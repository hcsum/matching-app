import dataSource from "../../data-source";
import { Photo } from "./model";

const PhotoRepository = dataSource.getRepository(Photo);

export default PhotoRepository;
