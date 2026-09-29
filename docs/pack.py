"""카페24 디자인 복구용 백업 만들기 (babyyang902 · base 디자인).
원본 백업의 항목(특히 서버 주문서 바로가기 심볼릭 링크)은 그대로 두고,
일반 파일은 지금 작업한 스킨 내용으로 바꾸고, 새로 생긴 파일은 추가한다."""
import os, tarfile, time

HERE = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.join(HERE, "orig_babyyang902_s2_260929142309_d_base_E.tar.gz")
SRC = os.path.join(HERE, "build")                 # build\base = 작업본 (이미지 제외, 주소 교체)
OUT = os.path.join(HERE, "babyyang902_s2_260929142309_d_base_E.tar.gz")
TOP = "base"
now = int(time.time())

def norm(info, mode):
    info.uid = info.gid = 0
    info.uname = info.gname = "nobody"
    info.mode = mode
    info.mtime = now
    return info

seen = set()
stats = {"link": 0, "replaced": 0, "added": 0, "dir": 0, "dropped": []}
with tarfile.open(ORIG, "r:gz") as src, tarfile.open(OUT, "w:gz", format=tarfile.GNU_FORMAT) as out:
    for m in src.getmembers():
        name = m.name.rstrip("/")
        seen.add(name)
        if m.issym() or m.islnk():
            out.addfile(norm(m, 0o777))
            stats["link"] += 1
        elif m.isdir():
            out.addfile(norm(m, 0o777))
            stats["dir"] += 1
        else:
            path = os.path.join(SRC, *name.split("/"))
            if os.path.isfile(path):
                ti = out.gettarinfo(path, arcname=name)
                with open(path, "rb") as f:
                    out.addfile(norm(ti, 0o666), f)
                stats["replaced"] += 1
            else:
                stats["dropped"].append(name)
    for root, dirs, files in os.walk(os.path.join(SRC, TOP)):
        dirs.sort(); files.sort()
        rel = os.path.relpath(root, SRC).replace("\\", "/")
        if rel not in seen:
            ti = out.gettarinfo(root, arcname=rel)
            out.addfile(norm(ti, 0o777)); seen.add(rel); stats["dir"] += 1
        for fn in files:
            name = rel + "/" + fn
            if name in seen:
                continue
            p = os.path.join(root, fn)
            ti = out.gettarinfo(p, arcname=name)
            with open(p, "rb") as f:
                out.addfile(norm(ti, 0o666), f)
            seen.add(name); stats["added"] += 1

print({k: (v if k != "dropped" else len(v)) for k, v in stats.items()})
print("dropped sample:", stats["dropped"][:8])
print("size MB", round(os.path.getsize(OUT) / 1048576, 2))
