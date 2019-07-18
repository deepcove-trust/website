# deepcove-website



## Developer Guidelines

### C# Logging
- Middleware, Controller and other apporpriate classes should make use of the ILoggerInterface.
`private readonly ILogger<ClassName>  _Logger`  

- Logging an exception within DOTNET Core use  [Method Name, User Name] Description of bug with params

Log Levels

| Level | Description | 
|-------|-------------|
| Debug | Lowest level of logging, shows pretty much everything. This is disabled on production so this should only be used when actively writing code.  __*It is suggested that you do not use this log level*__.
| Info  | Generic actions such as "Account created {username}". Useful on production but should not contain any sensitive information.|
| Warn  | Indicates a system is unhealthy but still working correctly. **Dev Note** I'd like to add warns to a table with the idea of sending once a day updates on any warnings that occur. |
| Error | Used in **TRY CATCH**. - Something has gone wrong and the action failed, an exception needs to be clearly displayed to users.|
**Any uncaught errors that go through the exception Middleware should be emailed to developers.**





### React Logging
- Log failed responses to the console and display the err.responseText message to a popup notification. Use
`[file name@method name] short description: response text`

Example: `[Login@attemptLogin] Error attempting login: ${err.ResponseText}`