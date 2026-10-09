import ariseSmpHero from '../assets/images/arise_smp_hero_1791476499363.jpg';
import asuraStudioAbstract from '../assets/images/asura_studio_abstract_1791476515128.jpg';
import discordSystemsShowcase from '../assets/images/discord_systems_showcase_1791476555166.jpg';
import minecraftDevShowcase from '../assets/images/minecraft_dev_showcase_1791476532941.jpg';

const ASSET_MAP: Record<string, string> = {
  '/src/assets/images/arise_smp_hero_1791476499363.jpg': ariseSmpHero,
  '/src/assets/images/asura_studio_abstract_1791476515128.jpg': asuraStudioAbstract,
  '/src/assets/images/discord_systems_showcase_1791476555166.jpg': discordSystemsShowcase,
  '/src/assets/images/minecraft_dev_showcase_1791476532941.jpg': minecraftDevShowcase,
};

export function resolveAssetUrl(url: string | undefined): string {
  if (!url) return asuraStudioAbstract;
  return ASSET_MAP[url] || url;
}

export {
  ariseSmpHero,
  asuraStudioAbstract,
  discordSystemsShowcase,
  minecraftDevShowcase,
};
