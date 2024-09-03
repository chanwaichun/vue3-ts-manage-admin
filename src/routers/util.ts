export function filterByAuthority(permissions: any, currentRoId: any) {
	if (permissions) {
		return permissions.includes(currentRoId);
	}
	return true;
}
