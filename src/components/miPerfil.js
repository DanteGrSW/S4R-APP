/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import UsersDataService from '../services/users';
import CarsDataService from '../services/cars';
import CarrerasDataService from '../services/carreras';
import Cookies from 'universal-cookie';
import '../App.css';
import defaultImg from '../assets/profilePics/default.png';
import avatar1 from '../assets/profilePics/avatar1.png';
import avatar2 from '../assets/profilePics/avatar2.png';
import avatar3 from '../assets/profilePics/avatar3.png';
import avatar4 from '../assets/profilePics/avatar4.png';
import avatar5 from '../assets/profilePics/avatar5.png';
import avatar6 from '../assets/profilePics/avatar6.png';
import avatar7 from '../assets/profilePics/avatar7.png';
import avatar8 from '../assets/profilePics/avatar8.png';

import { Category, ChartComponent, ColumnSeries, Inject, Legend, DataLabel, SeriesCollectionDirective, SeriesDirective, Tooltip } from '@syncfusion/ej2-react-charts';

const cookies = new Cookies();

const imgObj = {
	avatar1,
	avatar2,
	avatar3,
	avatar4,
	avatar5,
	avatar6,
	avatar7,
	avatar8,
};
const keys = Object.keys(imgObj);

const MiPerfil = (props) => {
	const initialPerfilState = {
		_id: '',
		apellido: '',
		nombre: '',
		direccion: '',
		correoE: '',
		dni: '',
		telefono: '',
		fechaNac: '',
		profilePic: '',
		idRol: '',
	};
	const [perfil, setPerfil] = useState(initialPerfilState);
	const [selectedImg, setSelectedImg] = useState(undefined);
	const [userFechaNac, setUserFechaNac] = useState('');
	const [modalEditar, setModalEditar] = useState(false);

	//carreras
	const [carreras, setCarreras] = useState([]);
	const [reporte, setReporte] = useState([]);

	//autos
	const [autos, setAutos] = useState([]);
	const [modalEditarAuto, setModalEditarAuto] = useState(false);
	const [modalEliminarAuto, setModalElminarAuto] = useState(false);
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedCar, setSelectedCar] = useState({
		_id: '',
		idUsuarioDuenio: '',
		patente: '',
		modelo: '',
		anio: '',
		agregados: '',
		historia: '',
		tallerAsociado: '',
		idVt: '',
	});

	//vt = Verificación Técnica
	const [vt, setVt] = useState([]);
	const [modalEditarVt, setModalEditarVt] = useState(false);
	const [selectedVt, setSelectedVt] = useState({
		_id: '',
		mataFuego: '',
		traje: '',
		motor: '',
		electricidad: '',
		estado: '',
		idUsuarioDuenio: '',
		idAuto: '',
	});

	useEffect(() => {
		getPerfilById(props.match.params._id);
		retrieveUser(props.match.params._id);
		getAutos(props.match.params._id);
	}, [props.match.params._id]);

	const getPerfilById = async (_id) => {
		console.log('Buscando data de perfil de: ', _id);

		UsersDataService.get(_id)
			.then(async (response) => {
				console.log('User Profile Data: ', response.data.users[0]);
				const perfilData = response.data.users[0];

				const fechaNacData = new Date(perfilData.fechaNac);
				const fechaNacDay = fechaNacData.getDate() + 1;
				// Cuidado! Enero es 0, no 1
				const fechaNacMonth = fechaNacData.getMonth() + 1;
				const fechaNacYear = fechaNacData.getFullYear();

				setUserFechaNac(`${fechaNacDay}/${fechaNacMonth}/${fechaNacYear}`);

				setPerfil(response.data.users[0]);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveUser = async (_id) => {
		await UsersDataService.get(_id)
			.then((response) => {
				console.log('Data: ', response.data);
				setPerfil(response.data.users[0]);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPerfil((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editData = (perfil) => {
		console.log('Selected: ', perfil);
		setModalEditar(true);
	};

	const closeModal = () => {
		setSelectedImg(undefined);
		setModalEditar(false);
		setValidationErrorMessage('');
	};

	const editar = async (perfil) => {
		if (selectedImg) perfil.profilePic = selectedImg;
		const result = await UsersDataService.editUser(perfil);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setPerfil(perfil);
			setModalEditar(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const buildErrorMessage = () => {
		if (validationErrorMessage !== '') {
			return (
				<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
					{validationErrorMessage}
				</Alert>
			);
		}
		return;
	};

	const refreshList = () => {
		getPerfilById(props.match.params._id);
		retrieveUser(props.match.params._id);
		getAutos(props.match.params._id);
	};

	//--------------------------------------------------------------------auto------------------------------------------------------------

	let getEstadoVt = async (idVt) => {
		if (idVt) {
			return await CarsDataService.findVt(idVt, '_id')
				.then((response) => {
					let estadoVt = true;
					const vt = response.data.vts[0];

					Object.keys(vt).map((datosVtProperty) => {
						if (
							datosVtProperty !== 'idUsuarioDuenio' &&
							datosVtProperty !== '_id' &&
							datosVtProperty !== 'idAuto' &&
							datosVtProperty !== 'tipoModif' &&
							datosVtProperty !== 'fechaUltModif' &&
							datosVtProperty !== 'idUsuarioModif'
						) {
							if (estadoVt === true && vt[datosVtProperty].toLowerCase() === 'si') {
								estadoVt = true;
							} else if (vt[datosVtProperty].toLowerCase() === 'no') {
								estadoVt = false;
							}
						}
					});
					return estadoVt ? 'Verificación OK' : 'Verificación NO OK';
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			return 'No Verificado';
		}
	};

	const getAutos = async (_id) => {
		await CarsDataService.find(_id, 'idUsuarioDuenio')
			.then(async (response) => {
				console.log('autos tiene', response.data.cars);
				await Promise.all(
					response.data.cars.map(async (car) => {
						const estadoVt = await getEstadoVt(car.idVt);
						console.log('Resultado Estado VT: ', estadoVt);
						car.estadoVt = estadoVt;
					})
				);
				setAutos(response.data.cars);
			})
			.catch((e) => {
				console.log(e);
			});

		await CarrerasDataService.findCarreras(_id)
			.then((response) => {
				console.log('carreras tiene', response.data.sprints);
				console.log('reporte tiene', response.data.reporte);
				const sprintsOrdenados = response.data.sprints.slice().sort((a, b) => new Date(b.fechaSprint) - new Date(a.fechaSprint));
				setCarreras(sprintsOrdenados);
				setReporte(response.data.reporte);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const selectCar = (action, car = {}) => {
		console.log('Selected: ', car);
		setSelectedCar(car);
		action === 'EditarAuto' ? setModalEditarAuto(true) : setModalElminarAuto(true);
	};

	const handleChangeAuto = (e) => {
		const { name, value } = e.target;
		setSelectedCar((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editarAuto = async (selectedCar) => {
		const result = await CarsDataService.editCar(selectedCar);
		if (result.status) {
			autos.forEach((car) => {
				if (car._id === selectedCar._id) {
					car.patente = selectedCar.patente;
					car.modelo = selectedCar.modelo;
					car.anio = selectedCar.anio;
					car.agregados = selectedCar.agregados;
					car.historia = selectedCar.historia;
					car.tallerAsociado = selectedCar.tallerAsociado;
					car.idUsuarioDuenio = selectedCar.idUsuarioDuenio;
					car.idVt = selectedCar.idVt;
				}
			});
			console.log('Edición exitosa');
			setValidationErrorMessage('');
			setAutos(autos);
			setModalEditarAuto(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const crearAuto = async (selectedCar) => {
		selectedCar.idUsuarioDuenio = props.match.params._id;
		const result = await CarsDataService.createCar(selectedCar);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			setModalEditarAuto(false);
			getAutos(props.match.params._id);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const eliminarAuto = (carId) => {
		deleteCar(carId);
		setModalElminarAuto(false);
	};

	const deleteCar = async (carId) => {
		console.log('Car to be deleted', carId);
		await CarsDataService.deleteCar(carId)
			.then(() => {
				getAutos(props.match.params._id);
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	let setModalButtonAuto = (selectedCar) => {
		if (selectedCar._id) {
			return (
				<button className="btn btn-success" onClick={() => editarAuto(selectedCar)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-success" onClick={() => crearAuto(selectedCar)}>
					Crear
				</button>
			);
		}
	};

	const closeModalAuto = () => {
		setModalEditarAuto(false);
		setValidationErrorMessage('');
	};

	const getIdVerContrincante = (idUsuarioP1, idUsuarioP2) => {
		if (props.match.params._id === idUsuarioP1) {
			return idUsuarioP2;
		} else {
			return idUsuarioP1;
		}
	};

	//--------------------------------------------------------------Verificación Técnica--------------------------------------------------

	let setModalButtonVt = (selectedVt) => {
		console.log('SelectecVt tiene:', selectedVt);
		if (selectedVt._id) {
			return (
				<button className="btn btn-success" onClick={() => editarVt(selectedVt)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-success" onClick={() => completarVt(selectedVt)}>
					Completar
				</button>
			);
		}
	};

	const completarVt = async (selectedVt) => {
		console.log('SelectecVt tiene:', selectedVt);
		const result = await CarsDataService.completarVt(selectedVt);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			setModalEditarVt(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const editarVt = async (selectedVt) => {
		autos.forEach((vt) => {
			if (vt._id === selectedVt._id) {
				vt.mataFuego = selectedVt.mataFuego;
				vt.traje = selectedVt.traje;
				vt.motor = selectedVt.motor;
				vt.electricidad = selectedVt.electricidad;
				vt.estado = selectedVt.estado;
				vt.idUsuarioDuenio = selectedVt.idUsuarioDuenio;
				vt.idAuto = selectedVt.idAuto;
			}
		});
		const result = await CarsDataService.editVt(selectedVt);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setVt(vt);
			setModalEditarVt(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const eliminarVt = (idVt, idAuto) => {
		deleteVt(idVt, idAuto);
		setModalEditarVt(false);
	};

	const deleteVt = async (idVt, idAuto) => {
		console.log('VT to be deleted', idVt, idAuto);
		await CarsDataService.deleteVt(idVt, idAuto)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const selectVt = async (action, car = {}) => {
		if (car.idVt) {
			await CarsDataService.findVt(car.idVt, '_id')
				.then((response) => {
					setVt(response.data.vts[0]);
					setSelectedVt(response.data.vts[0]);
					action === 'EditarVt' ? setModalEditarVt(true) : console.log('first');
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			setSelectedVt({ idAuto: car._id, idUsuarioDuenio: car.idUsuarioDuenio });
			action === 'EditarVt' ? setModalEditarVt(true) : console.log('first');
		}
	};

	const handleChangeVt = (e) => {
		const { name, value } = e.target;
		setSelectedVt((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const closeModalVt = () => {
		setModalEditarVt(false);
		setValidationErrorMessage('');
	};

	const accionesPorSesionEditUser = () => {
		if (cookies.get('_id') === props.match.params._id || cookies.get('idRol') === '1') {
			return (
				<div className="d-flex justify-content-center">
					<button className="btn btn-secondary" onClick={() => editData('Editar', perfil)}>
						Editar datos
					</button>
				</div>
			);
		} else {
			return <div></div>;
		}
	};
	const accionesPorSesionAddAuto = () => {
		if (cookies.get('_id') === props.match.params._id || cookies.get('idRol') === '1') {
			return (
				<div className="d-flex justify-content-start">
					<button className="btn btn-success mb-2 d-flex" onClick={() => selectCar('EditarAuto')}>
						Añadir un nuevo Auto
					</button>
				</div>
			);
		} else {
			return <div></div>;
		}
	};

	const accionesPorSesionAutoCards = (car) => {
		if (cookies.get('idRol') === '1') {
			return (
				<div className="col-12 justify-content-center">
					<button className="btn btn-warning col-5 mx-1" onClick={() => selectCar('EditarAuto', car)}>
						Editar
					</button>
					<button className="btn btn-danger col-5 mx-1" onClick={() => selectCar('Eliminar', car)}>
						Borrar
					</button>
					<br></br>
					<button className="btn btn-secondary col-11 mt-1" onClick={() => selectVt('EditarVt', car)}>
						Verificación Técnica
					</button>
				</div>
			);
		} else if (cookies.get('_id') === props.match.params._id) {
			return (
				<div className="d-flex justify-content-center">
					<button className="btn btn-warning col-5 mx-1" onClick={() => selectCar('EditarAuto', car)}>
						Editar
					</button>
					<button className="btn btn-danger col-5 mx-1" onClick={() => selectCar('Eliminar', car)}>
						Borrar
					</button>
				</div>
			);
		} else {
			return <div></div>;
		}
	};

	if (!cookies.get('_id')) {
		window.location.href = './errorPage';
		console.log('Necesita iniciar sesión y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita iniciar sesión y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	} else {
		return (
			<div className="App">
				<div className="container-fluid">
					<div className="d-flex vh-85 p-2 justify-content-center align-self-center">
						<div className="container-fluid align-self-center col card sombraCard form-perfil">
							<div className="table">
								<div className="table-wrapper">
									<div className="table-title">
										<div className="row">
											<div className="card-body">
												<div className="row align-items-center">
													<img className="col-lg-6" src={perfil.profilePic ? imgObj[perfil.profilePic] : defaultImg} alt="Imagen de Perfil" />
													<div className="col-lg-6">
														<div className="d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
															<h3 className="h2 text-black my-2">
																{perfil.nombre} {perfil.apellido}
															</h3>
														</div>
														<hr className="rounded"></hr>
														<ul className="list-unstyled mb-1-9">
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Dirección:</span>
																{perfil.direccion}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Telefono:</span> {perfil.telefono}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Email:</span> {perfil.correoE}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">DNI:</span> {perfil.dni}
															</li>
															<li className="display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Fecha de nacimiento:</span> {userFechaNac}
															</li>
															<br></br>
															<li>
																{accionesPorSesionEditUser()}
																<br></br>
																<br></br>
																<a className="btn btn-warning" href="#graficos">
																	Performance
																</a>
																<br></br>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
									<hr className="rounded"></hr>
									<div>
										<div className="container-fluid">
											<div className="col-lg-12 align-self-center w-auto">
												<div className="row">
													<div className="row">
														<div className="col-sm-4">
															<h2>
																Administrá tus <b>Autos</b>
															</h2>
															{accionesPorSesionAddAuto()}
														</div>
														<br></br>
													</div>
													<hr className="rounded"></hr>
													{autos.map((selectedCar) => {
														const id = `${selectedCar._id}`;
														const patente = `${selectedCar.patente}`;
														const modelo = `${selectedCar.modelo}`;
														const anio = `${selectedCar.anio}`;
														const agregados = `${selectedCar.agregados}`;
														const historia = `${selectedCar.historia}`;
														const tallerAsociado = `${selectedCar.tallerAsociado}`;
														const estadoVt = `${selectedCar.estadoVt}`;
														return (
															<div className="col-lg-4 pb-1">
																<div className="card">
																	<div className="card-body">
																		<h5 className="card-title">Patente: {patente}</h5>
																		<p className="card-text">
																			<strong>Marca & Modelo: </strong>
																			{modelo}
																			<br />
																			<strong>Año: </strong>
																			{anio}
																			<br />
																			<strong>Agregados: </strong>
																			{agregados}
																			<br />
																			<strong>Historia: </strong>
																			{historia}
																			<br />
																			<strong>Taller Mecánico: </strong>
																			{tallerAsociado}
																			<br />
																			<strong>Verificación Técnica: </strong>
																			{estadoVt}
																			<br />
																			<strong>Id: </strong>
																			{id}
																			<br />
																		</p>
																		<div className="container">{accionesPorSesionAutoCards(selectedCar)}</div>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</div>
									</div>
									<hr className="rounded"></hr>

									<div>
										<div className="container-fluid">
											<div id="graficos">
												<ChartComponent
													id="chartsReaccion"
													tooltip={{ enable: true }}
													primaryXAxis={{ valueType: 'Category', title: 'Auto' }}
													primaryYAxis={{ title: 'Tiempo' }}
													title="Promedio de Tiempo de Reaccion por Auto"
												>
													<Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
													<SeriesCollectionDirective>
														<SeriesDirective dataSource={reporte} xName="auto" yName="avgReaccion" type="Column" fill="red"></SeriesDirective>
													</SeriesCollectionDirective>
												</ChartComponent>
												<hr className="rounded"></hr>
												<ChartComponent
													id="chartsCien"
													tooltip={{ enable: true }}
													primaryXAxis={{ valueType: 'Category', title: 'Auto' }}
													primaryYAxis={{ title: 'Tiempo' }}
													title="Promedio de Tiempo de 100mts por Auto"
												>
													<Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
													<SeriesCollectionDirective>
														<SeriesDirective dataSource={reporte} xName="auto" yName="avgCien" type="Column" fill="#fbb00e"></SeriesDirective>
													</SeriesCollectionDirective>
												</ChartComponent>
											</div>
										</div>
									</div>
									<hr className="rounded"></hr>

									<div>
										<div className="container-fluid">
											<div className="col-lg-12 align-self-center w-auto">
												<div className="row">
													<div className="row">
														<div className="col-sm-4">
															<h2>Tus Carreras</h2>
														</div>
														<br></br>
													</div>
													{carreras.map((selectedCarrera) => {
														const idUsuarioP1 = `${selectedCarrera.idUsuarioP1}`;
														const idUsuarioP2 = `${selectedCarrera.idUsuarioP2}`;
														const idVehiculoP1 = `${selectedCarrera.idVehiculoP1}`;
														const idVehiculoP2 = `${selectedCarrera.idVehiculoP2}`;
														const reaccionP1 = `${selectedCarrera.reaccionP1}`;
														const reaccionP2 = `${selectedCarrera.reaccionP2}`;
														const tiempo100mtsP1 = `${selectedCarrera.tiempo100mtsP1}`;
														const tiempo100mtsP2 = `${selectedCarrera.tiempo100mtsP2}`;
														const tiempoLlegadaP1 = `${selectedCarrera.tiempoLlegadaP1}`;
														const tiempoLlegadaP2 = `${selectedCarrera.tiempoLlegadaP2}`;
														const idEvento = `${selectedCarrera.idEvento}`;
														return (
															<div className="col-lg-4 pb-1">
																<div className="card">
																	<div className="card-body">
																		<p className="card-text">
																			<strong>ID Usuario P1: </strong>
																			{idUsuarioP1}
																			<br />
																			<strong>ID Vehiculo P1: </strong>
																			{idVehiculoP1}
																			<br />
																			<strong>Reaccion P1: </strong>
																			{reaccionP1}
																			<br />
																			<strong>Tiempo 100mts P1: </strong>
																			{tiempo100mtsP1}
																			<br />
																			<strong>Tiempo Llegada P1: </strong>
																			{tiempoLlegadaP1}
																			<br />
																			<hr className="rounded"></hr>
																			<strong>ID Usuario P2: </strong>
																			{idUsuarioP2}
																			<br />
																			<strong>ID Vehiculo P2: </strong>
																			{idVehiculoP2}
																			<br />
																			<strong>Reaccion P2: </strong>
																			{reaccionP2}
																			<br />
																			<strong>Tiempo 100mts P2: </strong>
																			{tiempo100mtsP2}
																			<br />
																			<strong>Tiempo Llegada P2: </strong>
																			{tiempoLlegadaP2}
																			<br />
																			<strong>ID Evento: </strong>
																			{idEvento}
																			<br />
																		</p>
																		<a
																			className="btn btn-primary mx-1"
																			href={'/miperfil/' + getIdVerContrincante(selectedCarrera.idUsuarioP1, selectedCarrera.idUsuarioP2)}
																		>
																			Ver Contrincante
																		</a>
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

				<Modal isOpen={modalEditarAuto}>
					<ModalBody>
						<label>ID Auto</label>
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedCar._id} placeholder="ID Auto-Incremental" />
						<label>Patente</label>
						<input className="form-control" type="text" maxLength="10" name="patente" id="patenteField" onChange={handleChangeAuto} value={selectedCar.patente} />
						<label>Marca & Modelo</label>
						<input className="form-control" type="text" maxLength="50" name="modelo" id="modeloField" onChange={handleChangeAuto} value={selectedCar.modelo} />
						<label>Año</label>
						<input className="form-control" type="number" maxLength="4" name="anio" id="anioField" onChange={handleChangeAuto} value={selectedCar.anio} />
						<label>Agregados</label>
						<input
							className="form-control"
							type="text"
							maxLength="300"
							name="agregados"
							id="agregadosField"
							onChange={handleChangeAuto}
							value={selectedCar.agregados}
						/>
						<label>Historia</label>
						<input className="form-control" type="text" maxLength="200" name="historia" id="historiaField" onChange={handleChangeAuto} value={selectedCar.historia} />
						<label>Taller Mecánico</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="tallerAsociado"
							id="workshopField"
							onChange={handleChangeAuto}
							value={selectedCar.tallerAsociado}
						/>
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButtonAuto(selectedCar)}
						<button className="btn btn-danger" onClick={() => closeModalAuto()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEliminarAuto}>
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedCar._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => eliminarAuto(selectedCar._id)}>
							Sí
						</button>
						<button className="btn btn-danger" onClick={() => setModalElminarAuto(false)}>
							No
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEditarVt}>
					<ModalBody>
						<label>ID VT</label>
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedVt._id} placeholder="ID Auto-Incremental" />
						<label>Mata Fuego</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="50"
							name="mataFuego"
							id="mataFuegoField"
							onChange={handleChangeVt}
							value={selectedVt.mataFuego}
						/>
						<label>Traje</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="50"
							name="traje"
							id="trajeField"
							onChange={handleChangeVt}
							value={selectedVt.traje}
						/>
						<label>Motor</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="100"
							name="motor"
							id="motorField"
							onChange={handleChangeVt}
							value={selectedVt.motor}
						/>
						<label>Electricidad</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="300"
							name="electricidad"
							id="electricidadField"
							onChange={handleChangeVt}
							value={selectedVt.electricidad}
						/>
						<label>Estado</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="300"
							name="estado"
							id="estadoField"
							onChange={handleChangeVt}
							value={selectedVt.estado}
						/>
						<label>id Dueño del auto</label>
						<input
							className="form-control"
							readOnly
							type="text"
							maxLength="200"
							name="idUsuarioDuenio"
							id="idUsuarioDuenioField"
							placeholder="ID Dueño"
							value={selectedVt.idUsuarioDuenio}
						/>
						<label>id Auto</label>
						<input className="form-control" readOnly type="text" maxLength="50" name="idAuto" id="idAutoField" placeholder="ID Auto" value={selectedVt.idAuto} />
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButtonVt(selectedVt)}
						<button className="btn btn-danger" onClick={() => eliminarVt(selectedVt._id, selectedVt.idAuto)}>
							Borrar Verificación Técnica
						</button>
						<button className="btn btn-danger" onClick={() => closeModalVt()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEditar}>
					<ModalBody>
						<label>Nombre</label>
						<input className="form-control" type="text" maxLength="50" name="nombre" id="nombreField" onChange={handleChange} value={perfil.nombre} />
						<label>Apellido</label>
						<input className="form-control" type="text" maxLength="50" name="apellido" id="apellidoField" onChange={handleChange} value={perfil.apellido} />
						<div className="container">
							<p>Elegí una imagen de perfil</p>
							<div className="imgContainer">
								{keys.map((imageName, index) => (
									<img
										key={index}
										src={imgObj[imageName]}
										alt={`Profile ${index}`}
										width="20%"
										style={{
											border: selectedImg === imageName ? '4px solid purple' : '',
										}}
										onClick={() => setSelectedImg(imageName)}
									></img>
								))}
							</div>
						</div>
						<label>Dirección</label>
						<input className="form-control" type="text" maxLength="50" name="direccion" id="direccionField" onChange={handleChange} value={perfil.direccion} />
						<label>Telefono</label>
						<input className="form-control" type="number" maxLength="100" name="telefono" id="telefonoField" onChange={handleChange} value={perfil.telefono} />
						<label>Email</label>
						<input className="form-control" type="text" maxLength="50" name="correoE" id="correoEField" onChange={handleChange} value={perfil.correoE} />
						<label>DNI</label>
						<input className="form-control" type="number" maxLength="300" name="dni" id="dniField" onChange={handleChange} value={perfil.dni} />
						<label>Fecha de nacimiento</label>
						<input className="form-control" type="date" maxLength="200" name="fechaNac" id="fechaNacField" onChange={handleChange} value={perfil.fechaNac} />
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						<button className="btn btn-success" onClick={() => editar(perfil)}>
							Actualizar
						</button>
						<button className="btn btn-danger" onClick={() => closeModal()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
};

export default MiPerfil;
