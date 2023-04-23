import { Repository } from "typeorm";
import AppDataSource from "../../src/data-source";
import { MatchingEvent } from "../../src/domain/matching-event/model";
import MatchingEventRepository from "../../src/domain/matching-event/repo";
import { reset } from "./utils/reset-db";
import "./utils/connect-db";

beforeEach(reset);

describe("it should connect to db", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
  it("can save to DB", async () => {
    const newEvent1 = MatchingEvent.init({
      title: "三天cp第一期",
      startChoosingAt: new Date("2023-01-01"),
      phase: "matching",
    });
    const savedEvent = await MatchingEventRepository.save(newEvent1);

    const events = await MatchingEventRepository.find();

    expect(savedEvent.id).toBeTruthy();
    expect(events.length).toBe(1);
  });
});

