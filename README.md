## COMP90018 Mobile Computing Systems Programming Project Back-End

### Semester 2, 2017 - University of Melbourne

### Team
- Lisha Qiu
- Kai Zhang
- Yiqi Yu

### Structure of this project
- Front-End: [iOS Application](https://github.com/alexZhangKai/MobileProj2)
- Back-End: A RESTful API server [hosting on Heroku](https://facedbidentify.herokuapp.com/index)
- MongoDB Database and Face Recognition Service: Azure
- Details: Back-End server communicates with Azure face regonition services and mangage face database. Application managers could use it to update face database. It also connects with crime infomation database on Azure. Front-End sends requests to Back-End server to get related crime data and face identification results.

### Main Function
- Query crime information based on user's location and presenting in two pie charts. One pie chart is for information in current location, the other is for average information. They show different type of cirmes with their counts and persentages. Based on these information, users could evaluate living conditions of current area.
- Idenfify criminals' faces. Users could take photos of people looks suspicious and search these faces in this face database. It would help people identify danger also help police search for wanted criminals.
