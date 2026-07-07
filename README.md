# Portfolio

## Publications feed

The publications page now displays a Google Scholar-backed publication list and a citation graph.

### Daily refresh

Run the PowerShell script below to fetch the latest Scholar metadata and refresh the cached JSON file used by the site:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\refresh-scholar-data.ps1
```

To refresh automatically once per day, schedule this script with Windows Task Scheduler.