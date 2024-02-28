import { SqliteClientFactory, SqliteClient } from "@magieno/sqlite-client";
import { SqliteClientBase } from "@magieno/sqlite-client/dist/esm/clients/sqlite-client-base"; 
import { ExecuteSqlReturnValue } from "@magieno/sqlite-client/dist/esm/enums/execute-sql-return-value.enum";
import { ExecuteSqlRowMode } from "@magieno/sqlite-client/dist/esm/enums/execute-sql-row-mode.enum";
import { SqliteClientType } from "@magieno/sqlite-client/dist/esm/enums/sqlite-client-type.enum";

window.onload = () => {
  // Initialize event listeners once the window has loaded 
  document.getElementById('legacyClient')?.addEventListener('change', toggleLegacyCheckbox);

}

function toggleLegacyCheckbox(): void {
  const legacyClient = document.getElementById('legacyClient') as HTMLInputElement;
  const clientTypeSelect = document.getElementById('clientType') as HTMLSelectElement;

  clientTypeSelect.disabled = legacyClient.checked;
  clientTypeSelect.value = 'OPFS';
}

function runSqlite(): void {
  const clientTypeSelect = document.getElementById('clientType') as HTMLSelectElement;

  const legacyClient = document.getElementById('legacyClient') as HTMLInputElement;

  run(clientTypeSelect.value as SqliteClientType, legacyClient.checked);
}

// Adapt the HTML button onclick to directly call submitForm() without needing an inline event handler
document.querySelector('button')?.addEventListener('click', runSqlite);

const sqliteClients = {};

const run = async (clientType: SqliteClientType, legacyClient?: boolean) => {
  const webSqliteWorkerPath = "scripts/sqlite-worker.mjs"; // Must correspond to the path in your final deployed build.
  const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

  let webSqlite: SqliteClientBase;
  if (sqliteClients[clientType]) {
    webSqlite = sqliteClients[clientType];
  } else {
    if (legacyClient) {
      webSqlite = new SqliteClient(filename, "c", webSqliteWorkerPath)
    } else {
      webSqlite = SqliteClientFactory.getInstance({
        clientType: clientType,
        options: {
          filename: filename,
          flags: "c",
          sqliteWorkerPath: webSqliteWorkerPath,
        }
      });
    }
    await webSqlite.init();
    sqliteClients[clientType] = webSqlite;
  }

  await webSqlite.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
  await webSqlite.executeSql("INSERT INTO test VALUES(?, ?)", [6, 7]);
  const results = await webSqlite.executeSql("SELECT * FROM test", undefined, ExecuteSqlReturnValue.resultRows, ExecuteSqlRowMode.object);
  console.log("Results:", results);

}
