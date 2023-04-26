import {WebSqlite} from "@magieno/web-sqlite";

const bootstrap = async () => {
  const webSqliteWorkerPath = "scripts/web-sqlite-worker.js"; // Must correspond to the path in your final deployed build.
  const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

  const sqliteClient = new WebSqlite(filename, webSqliteWorkerPath)
  await sqliteClient.init();

  await sqliteClient.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
  await sqliteClient.executeSql("INSERT INTO test VALUES(?, ?)", [6,7]);
  const results = await sqliteClient.executeSql("SELECT * FROM test");
  console.log("Results:", results);
}


bootstrap();
