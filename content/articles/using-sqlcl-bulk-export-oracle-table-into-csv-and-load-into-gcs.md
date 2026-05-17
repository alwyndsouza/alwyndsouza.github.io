---
title: "Using SQLcl Bulk export Oracle table into CSV and load into GCS"
slug: "using-sqlcl-bulk-export-oracle-table-into-csv-and-load-into-gcs"
date: 2023-08-16
category: "data-engineering"
excerpt: "In this article I will explain how you can quickly download list of tables from Oracle database into csv format and copy them into google cloud store."
published: true
tags:
  - data-engineering
coverImage: "https://cdn-images-1.medium.com/max/800/1*5cXOVEilg0CpsL0mbuPJtQ.png"
---
In this article I will explain how you can quickly download list of tables from Oracle database into csv format and copy them into google cloud store.

### Required Software

* gsutil: This is a command-line tool for interacting with GCS. You can download and install it from the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
* SQLcl: This is a command-line interface for interacting with Oracle databases. You can download it from the [Oracle Technology Network](https://www.oracle.com/database/technologies/appdev/sqlcl.html).

### Instructions

1. Install gsutil and SQLcl on your local machine.
2. Create a bash script named `copy_tables_gcs.sh` in the `sqlcl/bin` folder of your local machine.
3. Add the following code to the `copy_tables_gcs.sh` script:

```
#!/bin/bash
while read value
do
 echo "Processing $value"
 echo "SET TERM OFF" > command.sql
 echo "SET FEED OFF" >> command.sql
 echo "SET SQLFORMAT CSV" >> command.sql
 echo "UNLOAD $value" >> command.sql
 echo "EXIT" >> command.sql
 wc -l $value*.csv
 rm -rf $value*.csv
 ./sql $CONN_STR @command.sql
 gsutil cp $value*.csv $GCS_BUCKET
done < table_list.txt
```

This script exports each table listed in the `table_list.txt` file to a CSV file, copies the CSV file to the specified GCS bucket, and deletes the local CSV file.

4. Create a file named `table_list.txt` in the `sqlcl/bin` folder and add the names of all the tables that need to be exported to CSV.

```
table1
table2
```

5. Set the database connection details in an environment variable named `CONN_STR`.

```
export CONN_STR=username/password@hostname:portnumber/service_name
```

6. Set the name of the GCS bucket in an environment variable named `GCS_BUCKET`.

```
export GCS_BUCKET=your-bucket-name
```

7. Make the `copy_tables_gcs.sh` script executable.

```
chmod 755 copy_tables_gcs.sh
```

8. Execute the `copy_tables_gcs.sh` script in the background using the following command:

```
nohup ./copy_tables_gcs.sh > one_time_copy.log 2>&1 &
```

This command runs the script in the background, redirects the output to the `one_time_copy.log` file, and detaches the script from the terminal.

---

*This article was originally published at <https://medium.com/@aradsouza/using-sqlcl-bulk-export-oracle-table-into-csv-and-load-into-gcs-a5b784ac3bdf>*
