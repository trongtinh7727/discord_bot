import time
import requests
import re
import json


def skipLesson(user, pwd, courseID):
    s = requests.Session()
    data = {
        'UserID': user,
        'UserPassword': pwd,
    }
    response = s.post(
        'https://elearning-ability.tdtu.edu.vn/Login/CheckLogin', data=data)
    print(response.content)

    data = {'courseID': courseID}
    # get lesson
    url = "https://elearning-ability.tdtu.edu.vn/Lesson/ListLesson"
    res = s.get(url, data=data)
    lessons = res.json()['list']
    # get unitID
    url = "https://elearning-ability.tdtu.edu.vn/Unit/ListUnit"
    nextUrl = "https://elearning-ability.tdtu.edu.vn/Unit/HandleStudyHistory"
    for i in lessons:
        print('---------lesson: ', i['ID'])
        data = {'lessonID': i['ID']}
        res = s.get(url, data=data)
        lstUnit = res.json()['lstUnit']
        for unit in lstUnit:
            data = {'unitID': unit['ID'],
                    'lessonID': unit['LessonID']}
            done = s.get(nextUrl, data=data)
            print(done.content)
