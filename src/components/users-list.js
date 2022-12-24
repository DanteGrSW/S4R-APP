/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import UserDataService from '../services/users';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const UsersList = () => {
	const getUserKeys = () => {
		if (cookies.get('_id')) {
			return {
				_id: '',
				apellido: '',
				correoE: '',
				direccion: '',
				dni: '',
				fechaNac: '',
				nombre: '',
				telefono: '',
			};
		}
	};

	const [users, setUsers] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [searchableParams] = useState(Object.keys(getUserKeys()));

	useEffect(() => {
		retrieveUsers();
	}, []);

	const onChangeSearchParam = (e) => {
		const searchParam = e.target.value;
		setSearchParam(searchParam);
	};

	const onChangeSearchValue = (e) => {
		const searchValue = e.target.value;
		setSearchValue(searchValue);
	};

	const retrieveUsers = () => {
		UserDataService.getAll()
			.then((response) => {
				console.log(response.data);
				setUsers(response.data.users);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const find = async (query, by) => {
		await UserDataService.find(query, by)
			.then((response) => {
				console.log(response.data);
				setUsers(response.data.users);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const findByParam = () => {
		find(searchValue, searchParam);
	};

	if (cookies.get('_id')) {
		return (
			<div className="App">
				<div className="container-fluid">
					<div className="d-flex vh-85 p-2 justify-content-center align-self-center">
						<div className="container-fluid align-self-center col card sombraCard form-abm">
							<div className="table">
								<div className="table-wrapper">
									<div className="table-title">
										<div className="row">
											<div className="col-sm-6 w-auto">
												<h2>
													<b>Usuarios</b>
												</h2>
											</div>
											<div className="input-group">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar usuario por "
													value={searchValue}
													onChange={onChangeSearchValue}
												/>
												<select onChange={onChangeSearchParam}>
													{searchableParams.map((param) => {
														return <option value={param}> {param.replace('_', '')} </option>;
													})}
												</select>
												<div className="input-group-append">
													<button className="btn btn-secondary mx-2 mt-1" type="button" onClick={findByParam}>
														Buscar
													</button>
												</div>
											</div>
										</div>
										<div className="col-lg-12 align-self-center">
											<div className="row">
												{users.map((user) => {
													const id = `${user._id}`;
													const nombre = `${user.nombre}`;
													const apellido = `${user.apellido}`;
													const idRol = `${user.idRol}`;
													const direccion = `${user.direccion}`;
													const email = `${user.correoE}`;
													return (
														<div className="col-lg-4 py-1">
															<div className="card">
																<div className="card-body">
																	<h5 className="card-title">{`${user.nombre} ${user.apellido}`}</h5>
																	<p className="card-text">
																		<strong>ID: </strong>
																		{id}
																		<br />
																		<strong>Nombre: </strong>
																		{nombre}
																		<br />
																		<strong>Apellido: </strong>
																		{apellido}
																		<br />
																		<strong>ID Rol: </strong>
																		{idRol}
																		<br />
																		<strong>Direccion: </strong>
																		{direccion}
																		<br />
																		<strong>Email: </strong>
																		{email}
																	</p>
																	<div className="row w-auto">
																		<Link to={'/miperfil/' + user._id} className="btn btn-warning mt-1">
																			View User
																		</Link>
																	</div>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		window.location.href = './errorPage';
		console.log('Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	}
};

export default UsersList;
