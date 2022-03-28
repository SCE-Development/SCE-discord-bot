import collections, itertools, functools, re, unicodedata, datetime, heapq, bisect, copy, math, cmath, numbers, decimal, fractions, random, statistics, operator, json, timeit, pprint
from io import StringIO
import sys
src = sys.argv[1]
sys.stdin = StringIO(sys.argv[2])
for k in sys.modules.keys():
    sys.modules[k] = None
del sys
del StringIO
def open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None):
    raise SyntaxError("no touchey open!!", ('ur_python_file_is_evil!!!!!.py', 420,69, "ur evil"))

exec(src)