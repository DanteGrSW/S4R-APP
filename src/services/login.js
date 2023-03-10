import http from '../http-common';
import bcrypt from 'bcryptjs';

export const matchPassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};
class LoginDataService {
	async get(correoE, password) {
		const validationResult = this.validarFormatoCorreo(correoE);
		console.log('Result Validaciones: ', validationResult);
		if (!validationResult.data.status) return validationResult;

		const result = await http.get(`/login?correoE=${correoE.toLowerCase()}`);
		console.log('DB Result: ', result);
		if (result.data.errorMessage) {
			result.data.status = false;
			result.data.errorMessage = 'El usuario y/o contraseña son incorrectos';
		} else {
			const hash = result.data.responseData.password;
			const match = await matchPassword(password, hash);
			if (match !== true) {
				result.data.status = false;
				result.data.errorMessage = 'El usuario y/o contraseña son incorrectos';
			}
		}
		return result;
	}

	validarFormatoCorreo(correoE) {
		const resultValidaciones = {
			data: {
				status: true,
			},
		};

		var validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!validRegex.test(correoE)) {
			resultValidaciones.data.status = false;
			resultValidaciones.data.errorMessage = 'Debe ingresar un correo electrónico válido';
		}

		return resultValidaciones;
	}
}

export default new LoginDataService();
