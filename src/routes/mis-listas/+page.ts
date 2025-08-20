import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Tierlist from '$lib/classes/Tierlist';
import type { UUID } from 'crypto';

export const load: PageLoad = async ({ params }) => {
	let tierlists = await Tierlist.getAllFromDatabase();

	return {tierlists: tierlists.map(tierlist => tierlist.toJSON())};
};