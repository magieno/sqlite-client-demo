import {WebSqlite} from "@magieno/web-sqlite";

const bootstrap = async () => {
  const webSqliteWorkerPath = "scripts/web-sqlite-worker.js"; // Must correspond to the path in your final deployed build.
  const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

  const webSqlite = new WebSqlite(filename, webSqliteWorkerPath)
  await webSqlite.init();

  await webSqlite.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
  await webSqlite.executeSql("INSERT INTO test VALUES(?, ?)", [6,7]);
  const results = await webSqlite.executeSql("SELECT * FROM test");
  console.log("Results:", results);
}


bootstrap();
