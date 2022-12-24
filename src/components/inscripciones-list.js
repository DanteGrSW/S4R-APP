/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import InscripcionDataService from '../services/inscripcion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import QRcode from 'qrcode';

const InscripcionesList = () => {
	const [inscripciones, setinscripciones] = useState([]);
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [selectedInscripcion] = useState({
		_id: '',
		idEvento: '',
		claseId: '',
		idUsuario: '',
		vehiculoId: '',
		fechaSprint: '',
		matcheado: 'no',
		ingreso: 'no',
	});
	const [searchableParams] = useState(Object.keys(selectedInscripcion));
	const [qrcode, setQrCode] = useState('');
	const [modalCodigoQR, setModalCodigoQR] = useState(false);

	useEffect(() => {
		retrieveInscripciones();
	}, []);

	const onChangeSearchParam = (e) => {
		const searchParam = e.target.value;
		setSearchParam(searchParam);
	};

	const onChangeSearchValue = (e) => {
		const searchValue = e.target.value;
		setSearchValue(searchValue);
	};

	const findByParamRegularUser = () => {
		findRegularUser(searchValue, searchParam);
	};

	const retrieveInscripciones = async () => {
		await InscripcionDataService.get(cookies.get('_id'), 'idUsuario')
			.then((response) => {
				console.log('Data: ', response.data);
				setinscripciones(response.data.inscripciones);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.inscripciones.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const findRegularUser = async (query, by) => {
		console.log(`Query: ${query} | By: ${by}`);
		if (by !== 'idUsuario' || (by === 'idUsuario' && (query === cookies.get('_id') || query === ''))) {
			await InscripcionDataService.getRegularUser(query, by, cookies.get('_id'))
				.then((response) => {
					console.log('Data: ', response.data);
					setinscripciones(response.data.inscripciones);
					setTotalResults(response.data.total_results);
					setEntriesPerPage(response.data.inscripciones.length);
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			setinscripciones([]);
		}
	};

	// Generador de codigo QR
	function generateQrCode(inscripcion) {
		// console.log('Datos de Inscripcion: ', inscripcion);
		const message = `Usuario ID: ${inscripcion.idUsuario} inscripto en el Evento ID: ${inscripcion.idEvento} Clase ID: ${inscripcion.claseId}`;
		QRcode.toDataURL(message, (err, message) => {
			if (err) return console.error(err);

			console.log(message);
			setQrCode(message);
		});
	}

	const verQr = (inscripcion) => {
		setModalCodigoQR(true);
		generateQrCode(inscripcion);
	};

	const closeModalCodigoQR = () => {
		setModalCodigoQR(false);
	};

	if (!cookies.get('_id')) {
		window.location.href = './errorPage';
		console.log('Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	} else {
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
													Mis <b>Inscripciones</b>
												</h2>
											</div>
											<div className="input-group mb-3 col-sm-12">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar inscripcion por "
													value={searchValue}
													onChange={onChangeSearchValue}
												/>
												<select onChange={onChangeSearchParam}>
													{searchableParams.map((param) => {
														return <option value={param}> {param.replace('_', '')} </option>;
													})}
												</select>
												<div className="input-group-append">
													<button className="btn btn-secondary mx-2 mt-1" type="button" onClick={findByParamRegularUser}>
														Buscar
													</button>
												</div>
											</div>
										</div>
									</div>
									<div className="overflowAuto">
										<div className="container-fluid divTableInscripcionesUser">
											<table className="table table-striped w-auto table-hover tableData">
												<thead>
													<tr>
														<th className="thData fixedColHead">Acciones</th>
														<th className="thData">Id</th>
														<th className="thData">ID Evento</th>
														<th className="thData">ID Clase</th>
														<th className="thData">ID Usuario</th>
														<th className="thData">ID Vehiculo</th>
														<th className="thData">Precio</th>
														<th className="thData">Fecha</th>
														<th className="thData">Matcheado</th>
														<th className="thData">Ingreso</th>
													</tr>
												</thead>
												<tbody>
													{inscripciones.map((inscripcion) => {
														const id = `${inscripcion._id}`;
														const idEvento = `${inscripcion.idEvento}`;
														const claseId = `${inscripcion.claseId}`;
														const idUsuario = `${inscripcion.idUsuario}`;
														const vehiculoId = `${inscripcion.vehiculoId}`;
														const precio = `${inscripcion.precio}`;
														const fechaSprint = `${inscripcion.fechaSprint}`;
														const matcheado = `${inscripcion.matcheado}`;
														const ingreso = `${inscripcion.ingreso}`;
														return (
															<tr>
																<td className="tdData">
																	<button className="btn btn-primary fixedColRow" onClick={() => verQr(inscripcion)}>
																		Ver QR
																	</button>
																</td>
																<td className="tdData">{id}</td>
																<td className="tdData">{idEvento}</td>
																<td className="tdData">{claseId}</td>
																<td className="tdData">{idUsuario}</td>
																<td className="tdData">{vehiculoId}</td>
																<td className="tdData">{precio}</td>
																<td className="tdData">{fechaSprint}</td>
																<td className="tdData">{matcheado}</td>
																<td className="tdData">{ingreso}</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
									<div className="clearfix">
										<div className="hint-text">
											Mostrando <b>{`${entriesPerPage}`}</b> de <b>{`${totalResults}`}</b> registros
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal isOpen={modalCodigoQR}>
					<ModalBody>
						<p className="h1 text-center">Codigo de Inscripcion</p>
						<label>Con el siguiente codigo QR, usted podra ingresar al predio por la entrada preferencial y abonar en efectivo:</label>
						{qrcode && (
							<>
								<img src={qrcode} />
								<a className="btn btn-warning" href={qrcode} download="qrcode.png">
									Download
								</a>
							</>
						)}
					</ModalBody>
					<ModalFooter>
						<button className="btn btn-danger" onClick={() => closeModalCodigoQR()}>
							Cerrar
						</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
};

export default InscripcionesList;
