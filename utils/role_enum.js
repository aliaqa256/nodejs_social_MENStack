exports.role_enum = (role) => {
	switch (role) {
		case 0:
			role = "user";
			break;
		case 1:
			role = "vip";
			break;
		case 2:
			role = "superuser";
			break;
	}
	return role;
};
