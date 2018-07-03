import { Config } from '../config';
import { Paramorph } from '../model';
import { ProjectStructure } from './ProjectStructure';
import { FrontMatter } from './FrontMatter';
import { PageFactory } from './PageFactory';
export declare class Loader {
    private structure;
    private frontMatter;
    private pageFactory;
    constructor(structure: ProjectStructure, frontMatter: FrontMatter, pageFactory: PageFactory);
    load(config: Config): Promise<Paramorph>;
    private getCollectionFileTuples(specialDirs);
    private addTags(paramorph);
    private generateMissingDescriptions(paramorph);
    private addDefaultImages(paramorph);
    private descriptionFromContent(renderer, page);
    private descriptionFromPages(index, page);
    private imageFromContent(renderer, page);
    private validatePages(paramorph);
    private validateCategories(paramorph);
}
export default Loader;
