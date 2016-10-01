# Quick and Dirty date and time editing.

import csv
import sys
from datetime import datetime

FIELD = 1
# 12/24/2009 12:00:00 AM
FMT = '%m/%d/%Y %I:%M:%S %p'

readablefile = csv.reader(sys.stdin)
writablefile = csv.writer(sys.stdout)
for row in readablefile:
    dt = datetime.strptime(row[FIELD], FMT)
    row[FIELD] = dt.strftime('%Y-%m-%d')
    writablefile.writerow(row)
