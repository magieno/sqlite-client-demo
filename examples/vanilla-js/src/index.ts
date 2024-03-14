import { SqliteClient } from "@magieno/sqlite-client"; 
import { SqliteClientTypeEnum } from "@magieno/sqlite-client/dist/esm/enums/sqlite-client-type.enum";


function runSqlite(): void {
  const clientTypeSelect = document.getElementById('clientType') as HTMLSelectElement;

  run(clientTypeSelect.value as SqliteClientTypeEnum);
}

// Adapt the HTML button onclick to directly call submitForm() without needing an inline event handler
document.querySelector('button')?.addEventListener('click', runSqlite);

const sqliteClients = {};

const run = async (clientType: SqliteClientTypeEnum) => {
  const webSqliteWorkerPath = "scripts/sqlite-worker.mjs"; // Must correspond to the path in your final deployed build.
  const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

  let webSqlite: SqliteClient;
  if (sqliteClients[clientType]) {
    webSqlite = sqliteClients[clientType];
  } else {

    webSqlite = new SqliteClient(
      {
        type: clientType,
        filename: filename,
        sqliteWorkerPath: webSqliteWorkerPath,
        flags: "c",
      }
    );

    await webSqlite.init();
    sqliteClients[clientType] = webSqlite;
  }

  await webSqlite.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)", []);
  await webSqlite.executeSql("INSERT INTO test VALUES(?, ?)", [6, 7]);
  const results = await webSqlite.executeSql("SELECT * FROM test", []);
  console.log("Results:", results);

}
