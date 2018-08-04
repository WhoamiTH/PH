def test():
    return [i for i in range(10,20)]

import datetime

import datetime

def dateRange(start, end, step=1, format="%Y-%m-%d"):
    strptime, strftime = datetime.datetime.strptime, datetime.datetime.strftime
    days = (strptime(end, format) - strptime(start, format)).days
    return [strftime(strptime(start, format) + datetime.timedelta(i), format) for i in range(0, days, step)]

def listTodic():
    l = []
    data = [i for i in range(10)]
    value = [t for t in range(10)]
    for item in range(len(data)):
        dic = {}
        dic["data"] = data[item]
        dic["value"] = value[item]
        l.append(dic)
    for item in l:
        print(item)
    return l



if __name__ == '__main__':
    listTodic()
    print(dateRange("2017-01-01", "2017-1-13"))
    # ["2017-01-01", "2017-01-02"]