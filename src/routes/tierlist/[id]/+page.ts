import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Tierlist from '$lib/classes/Tierlist';
import type { UUID } from 'crypto';

export const load: PageLoad = async ({ params, depends }) => {
	depends(`tierlist:${params.id}`);
	let tierlist = await Tierlist.getEditingById(params.id as UUID);
	if (!tierlist) {
		error(404, 'Not found');
	}
	return {tierlist: tierlist.toJSON()};
};