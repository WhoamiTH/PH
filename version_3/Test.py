def test():
    return [i for i in range(10,20)]

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