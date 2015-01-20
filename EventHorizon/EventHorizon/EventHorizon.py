from pymongo.mongo_client import MongoClient
import datetime
import pymysql

try:
    dt = datetime.datetime.now()
    conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='cfvABC2104', db='sbariapp')

    client = MongoClient()
    db = client['MTheory']
    collection = db['Theories']
    nearToDeathStars =  collection.find({"When": {"$lt": dt}})
    client.close()

    for star in nearToDeathStars:
        try:
         cur = conn.cursor()
         cur.execute("INSERT INTO `kronos` (`Name`, `UserId`, `When`, `GoingTo`, `Viewed`,`Category`,`Owner`) VALUES ('"+
                     star['EventName']+"', '"+
                     str(star['PublisherId'])+"', '"+
                     star['When'].strftime("%Y-%m-%d %H:%M:%S")+"', '"+
                     str(star['Stats']['GoingTo'])+"', '"+
                     str(star['Stats']['ViewedNumber'])+
                     star['Category']+"', '"+
                     star['Owner']+"', '"+
                     "');")
         cur.close()
        except Exception as innerEx:
            print('2')

    conn.close()
except  Exception as ex:
    print('1')
