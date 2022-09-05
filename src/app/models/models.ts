
export class Title {
    id!: string;
    name!: string;
    level_1_title!: string;
    full_name!: string;
    external_id!: number;
    season_number!: any;
    episode_number!: any;
    title_level!: any;
}

export class Asset {
    id!: number;
    isSelected!: boolean;
    titles!: Title[];
}