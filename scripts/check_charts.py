#!/usr/bin/env python3
"""Heuristic check that charts are drawn to their own scales.

Review aid, not a CI gate: it reports candidates, and many are false
positives (tables, timelines with even spacing, categorical axes, UI
mock-ups). Run from the repository root:

    python scripts/check_charts.py

Three passes:
  1. SVG horizontal axes: numeric tick labels on one row, mapped through
     the vertical grid lines; flags uneven ticks and bars whose ends do
     not match the range printed beside them.
  2. SVG vertical axes: numeric tick labels in one column; flags uneven
     ticks and bars whose tops do not match the value printed above.
  3. CSS bar charts (.bars): flags bars whose --v width is not roughly
     proportional to the value shown, unless the title says "not to
     scale" or "log scale".

See docs/numeric-review.md for how the findings were triaged.
"""
import re, glob, html, sys
from collections import defaultdict


def horizontal():
    NUM=r'[−-]?\d+(?:\.\d+)?'
    def attrs(tag): return dict(re.findall(r'([\w-]+)="([^"]*)"',tag))
    def num(s):
        s=html.unescape(s).replace('−','-').strip()
        m=re.fullmatch(r'('+NUM+r')\s*(?:°C|°|%|mm/s|mm|s|h|g|MPa|GPa|min|W|kg|\$)?',s)
        return float(m.group(1)) if m else None
    def rng(s):
        s=html.unescape(s).replace('−','-')
        m=re.search(r'('+NUM+r')\s*(?:°C|%)?\s*[–-]\s*('+NUM+r')',s)
        if m: return float(m.group(1)),float(m.group(2))
        m=re.search(r'(?:≈|~|about)?\s*('+NUM+r')\s*(°C|%|mm/s|MPa|GPa|mm|h)\b',s)
        if m: return float(m.group(1)),float(m.group(1))
        return None
    def fit(pairs):
        (p0,v0),(p1,v1)=pairs[0],pairs[-1]
        if p1==p0: return None
        k=(v1-v0)/(p1-p0); return k,v0-k*p0
    out=[]
    for f in sorted(glob.glob('**/*.html',recursive=True)):
        t=open(f,encoding='utf-8').read()
        for si,svg in enumerate(re.findall(r'<svg.*?</svg>',t,re.S)):
            label=attrs(svg[:svg.index('>')]).get('aria-label','')[:70]
            texts=[]
            for m in re.finditer(r'<text([^>]*)>(.*?)</text>',svg,re.S):
                a=attrs(m.group(1)); 
                if 'x' not in a or 'y' not in a: continue
                try: texts.append((float(a['x']),float(a['y']),re.sub('<[^>]+>','',m.group(2)),a.get('class','')))
                except: pass
            rects=[]
            for m in re.finditer(r'<rect([^>]*)/?>',svg):
                a=attrs(m.group(1))
                try: rects.append((float(a['x']),float(a['y']),float(a['width']),float(a['height'])))
                except: pass
            # horizontal axes: ticks sharing y
            from collections import defaultdict
            rows=defaultdict(list)
            for x,y,s,c in texts:
                v=num(s)
                if v is not None: rows[round(y)].append((x,v,c))
            grids=sorted(set(float(x) for x in re.findall(r'M\s*([\d.]+)[ ,]+[\d.]+\s*V',svg)))
            for y,ticks in rows.items():
                ticks=sorted(ticks)
                if len(ticks)<3: continue
                vals=[v for _,v,_ in ticks]
                if not all(b>a for a,b in zip(vals,vals[1:])): continue
                # positions: use grid lines if same count
                gx=[g for g in grids]
                if len(gx)==len(ticks): pos=gx
                else: pos=[x for x,_,_ in ticks]
                pairs=list(zip(pos,vals))
                fr=fit(pairs)
                if not fr: continue
                k,b=fr
                # linearity of ticks
                for p,v in pairs:
                    if abs(k*p+b-v)>abs(vals[-1]-vals[0])*0.03:
                        out.append(f"{f} svg#{si} [{label}] tick {v} at {p} off-scale (pred {k*p+b:.1f})")
                span=abs(vals[-1]-vals[0])
                # bars: rects on rows with a range label to their right
                for rx,ry,rw,rh in rects:
                    if rh>40 or rw<=0: continue
                    if rx < min(pos)-5 or rx+rw > max(pos)+5+span: pass
                    lab=[(x,s) for x,yy,s,c in texts if abs((yy-4)-(ry+rh/2))<rh/2+6 and x>=rx+rw-2 and x<rx+rw+40]
                    if not lab: continue
                    r=rng(lab[0][1])
                    if not r: continue
                    v0,v1=k*rx+b,k*(rx+rw)+b
                    tol=max(span*0.04,1)
                    if r[0]==r[1]:
                        ok=abs(v0-r[0])<tol or abs(v1-r[0])<tol or (v0-tol<=r[0]<=v1+tol)
                    else:
                        ok=abs(v0-r[0])<tol and abs(v1-r[1])<tol
                    if not ok:
                        out.append(f"{f} svg#{si} [{label}] bar '{lab[0][1].strip()}' drawn {v0:.1f}–{v1:.1f}")
    print("\n".join(out)); print(len(out),"findings",file=sys.stderr)


def vertical():
    NUM=r'[−-]?\d+(?:\.\d+)?'
    def attrs(tag): return dict(re.findall(r'([\w-]+)="([^"]*)"',tag))
    def num(s):
        s=html.unescape(re.sub('<[^>]+>','',s)).replace('−','-').strip()
        m=re.fullmatch(r'≈?\s*('+NUM+r')\s*(?:°C|°|%|mm/s|mm|s|h|g|MPa|GPa|min|W|kg|×|x)?',s)
        return float(m.group(1)) if m else None
    for f in sorted(glob.glob('**/*.html',recursive=True)):
        t=open(f,encoding='utf-8').read()
        for si,svg in enumerate(re.findall(r'<svg.*?</svg>',t,re.S)):
            if 'transform="translate' in svg or '<g transform' in svg: continue
            label=attrs(svg[:svg.index('>')]).get('aria-label','')[:60]
            texts=[]
            for m in re.finditer(r'<text([^>]*)>(.*?)</text>',svg,re.S):
                a=attrs(m.group(1))
                try: texts.append((float(a['x']),float(a['y']),m.group(2),a.get('class','')))
                except: pass
            cols=defaultdict(list)
            for x,y,s,c in texts:
                v=num(s)
                if v is not None and 't-c' not in c: cols[round(x)].append((y,v))
            hgrid=sorted(set(float(y) for y in re.findall(r'[MH ]\s*[\d.]+[ ,]+([\d.]+)\s*H',svg)))
            for x,ticks in cols.items():
                ticks=sorted(ticks)  # by y ascending (top first)
                if len(ticks)<3: continue
                vals=[v for _,v in ticks]
                if not all(a>b for a,b in zip(vals,vals[1:])): continue
                ys=[y for y,_ in ticks]
                k=(vals[-1]-vals[0])/(ys[-1]-ys[0]); b=vals[0]-k*ys[0]
                span=abs(vals[0]-vals[-1])
                off=[(v,y,round(k*y+b,1)) for y,v in ticks if abs(k*y+b-v)>span*0.03]
                if off: print(f"{f} svg#{si} [{label}] y-axis at x={x}: off-scale ticks {off}")
                # bars: rects whose bottom sits near the zero/baseline and have a numeric label above
                for m in re.finditer(r'<rect([^>]*)/?>',svg):
                    a=attrs(m.group(1))
                    try: rx,ry,rw,rh=(float(a[q]) for q in ('x','y','width','height'))
                    except: continue
                    if rw>120 or rh<4: continue
                    cx=rx+rw/2
                    lab=[(s) for tx,ty,s,c in texts if abs(tx-cx)<rw/2+4 and ry-26<ty<ry+2 and num(s) is not None]
                    if not lab: continue
                    v=num(lab[0]); top=k*ry+b
                    if abs(top-v)>max(span*0.05,0.5):
                        print(f"{f} svg#{si} [{label}] bar labelled {html.unescape(lab[0])} reaches {top:.1f} on axis x={x}")


def css_bars():
    for f in sorted(glob.glob('**/*.html',recursive=True)):
        t=open(f,encoding='utf-8').read()
        for m in re.finditer(r'bars-title">([^<]*)</div>(.*?)</div>\s*</div>',t,re.S):
            title=html.unescape(m.group(1))
            if 'not to scale' in title or 'log scale' in title: continue
            pts=[]
            for n,v,e in re.findall(r'<span>([^<]*)</span><i style="--v:([\d.]+)%"></i><em>([^<]*)</em>',m.group(2)):
                nums=[float(x) for x in re.findall(r'\d+(?:\.\d+)?',html.unescape(e).replace(',',''))]
                if nums: pts.append((html.unescape(n),float(v),sum(nums)/len(nums),e))
            if len(pts)<3: continue
            k=sum(v*x for _,v,x,_ in pts)/sum(x*x for _,v,x,_ in pts)
            for n,v,x,e in pts:
                if abs(k*x-v)>max(6,0.15*v): print(f"{f} | {title[:60]} | {n}: --v {v:.0f}% for {html.unescape(e)} (proportional: {k*x:.0f}%)")


if __name__ == "__main__":
    for name, fn in (("SVG horizontal axes", horizontal), ("SVG vertical axes", vertical), ("CSS bar charts", css_bars)):
        print(f"== {name}")
        fn()
