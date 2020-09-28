# credits
- https://github.com/SonarSource/docker-sonarqube/blob/master/example-compose-files/sq-with-postgres/docker-compose.yml

# run docker
```
docker-compose up -d
```
# wait 30 seconds

# load into browser (if windows 10 or mac)
localhost:9000

## troubleshoot windows 7
```
docker-machine ip
192.168.99.100
```
## load into browser for windows 7 
```
192.168.99.100:9000
```

# login 
admin, admin

# Add this project to sonar 
- click - + next to [A] > Create new project > cmd-try-catch > Generate token - enter [cmd-try-catch] - 
```
14d8b0f0ebbbe05704afc7316b8995a92b79a1e9
```
# put this token into sonar-project.properties 
```
sonar.login=14d8b0f0ebbbe05704afc7316b8995a92b79a1e9
```
# run sonar 
```
npm run sonar 
```

# be sure to click - allow access when firewall dialog appears
allow access

# view this 
```
http://localhost:9000/dashboard?id=cmd-try-catch
```

# teardown
```
docker-compose down
docker volume prune 
Y
docker-network prune
Y
```
