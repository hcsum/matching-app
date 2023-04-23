import AppDataSource from "../../../src/data-source";

export async function reset(): Promise<void> {
  const names = AppDataSource.entityMetadatas.map((_) => _.tableName);

  await AppDataSource.transaction(async (txManger) => {
    for (const name of names) {
      await txManger.queryRunner.query(`TRUNCATE TABLE "${name}" CASCADE`);
    }
  });
}

