import { SqliteClientFactory, SqliteClient, SqliteClientBase } from "@magieno/sqlite-client";
import { SqliteClientType } from "@magieno/sqlite-client/dist/esm/enums/sqlite-message-type.enum";
import { ExecuteSqlReturnValue, ExecuteSqlRowMode } from "@magieno/sqlite-client/dist/esm/messages/execute-sql.message";

window.onload = () => {
  // Initialize event listeners once the window has loaded
  document.getElementById('clientType')?.addEventListener('change', toggleWorkerCheckbox);
  document.getElementById('legacyClient')?.addEventListener('change', toggleLegacyCheckbox);

}

function toggleWorkerCheckbox(): void {
  const clientTypeSelect = document.getElementById('clientType') as HTMLSelectElement;
  const useWorkerCheckbox = document.getElementById('useWorker') as HTMLInputElement;

  if (clientTypeSelect.value as SqliteClientType === SqliteClientType.Memory) {
    useWorkerCheckbox.disabled = false;
  } else {
    useWorkerCheckbox.disabled = true;
    useWorkerCheckbox.checked = false;
  }
}

function toggleLegacyCheckbox(): void {
  const legacyClient = document.getElementById('legacyClient') as HTMLInputElement;
  const clientTypeSelect = document.getElementById('clientType') as HTMLSelectElement;
  const useWorkerCheckbox = document.getElementById('useWorker') as HTMLInputElement;

  clientTypeSelect.disabled = legacyClient.checked;
  clientTypeSelect.value = 'OPFS';
  useWorkerCheckbox.disabled = legacyClient.checked;
}

function runSqlite(): void {
  const clientTypeSelect = document.getElementById('clientType') as HTMLSelectElement;
  const useWorkerCheckbox = document.getElementById('useWorker') as HTMLInputElement;

  const legacyClient = document.getElementById('legacyClient') as HTMLInputElement;

  run(clientTypeSelect.value as SqliteClientType, legacyClient.checked, useWorkerCheckbox.checked);
}

// Adapt the HTML button onclick to directly call submitForm() without needing an inline event handler
document.querySelector('button')?.addEventListener('click', runSqlite);


const sqliteClients = {};

const run = async (clientType: SqliteClientType, legacyClient?: boolean, useWorker?: boolean) => {
  const webSqliteWorkerPath = "scripts/sqlite-worker.mjs"; // Must correspond to the path in your final deployed build.
  const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.
  let cachedClientTypeName: string = clientType;
  
  if (useWorker) {
    cachedClientTypeName = 'MEMORY_WORKER';
  }

  let webSqlite: SqliteClientBase;
  if (sqliteClients[cachedClientTypeName]) {
    webSqlite = sqliteClients[cachedClientTypeName];
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
          useWorker: useWorker,
        }
      });
    }
    await webSqlite.init();
    sqliteClients[cachedClientTypeName] = webSqlite;
  }


  await webSqlite.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
  await webSqlite.executeSql("INSERT INTO test VALUES(?, ?)", [6, 7]);
  const results = await webSqlite.executeSql("SELECT * FROM test", undefined, ExecuteSqlReturnValue.resultRows, ExecuteSqlRowMode.object);
  console.log("Results:", results);
}
