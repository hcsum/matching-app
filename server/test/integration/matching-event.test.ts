import { Repository } from "typeorm";
import AppDataSource from "../../src/data-source";
import { MatchingEvent } from "../../src/domain/matching-event/model";
import MatchingEventRepository from "../../src/domain/matching-event/repo";
// matching phase
// no matching
// insist
// reverse

// let matchingEventRepo: typeof MatchingEventRepository
// let matchingEventRepo: Repository<MatchingEvent>;

describe("it should connect to db", () => {
  beforeAll(async () => {
    const dbConnection = await AppDataSource.initialize();
  });

  it("should not throw", () => {
    expect(true).toBe(true);
  });
});

