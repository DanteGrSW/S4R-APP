import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Inicio from './components/inicio';
import Login from './components/login';
import ErrorPage from './components/errorPage';
import UsersList from './components/users-list';
import InscripcionesList from './components/inscripciones-list';
import MiPerfil from './components/miPerfil';
import Inscripcion from './components/inscripcion';
import Cookies from 'universal-cookie';
import './styles/inicio.css';
import './styles/buttons.css';
import Logo from './assets/otherPics/LogoS4Rok.png';

const cookies = new Cookies();

function App() {
	const completarMenu = () => {
		if (cookies.get('_id')) {
			console.log('User Id: ', cookies.get('_id'));
			console.log('Id Rol: ', cookies.get('idRol'));
			return completarMenuUser();
		}
	};

	const completarMenuUser = () => {
		return (
			<div>
				<li key="DropdownUser">
					<div>
						<ul aria-labelledby="dropdownMenuButton1">
							<li key="UserPerfil">
								<a href={'/miperfil/' + cookies.get('_id')} className="text-light nav-link">
									Mi Perfil
								</a>
							</li>
							<li key="UserPerfil">
								<a href={'/inscripcion'} className="text-light nav-link">
									Inscribite
								</a>
							</li>
							<li key="UserPerfil">
								<a href={'/inicio'} className="text-light nav-link">
									Inicio
								</a>
							</li>
							<li key="AdminUsuarios">
								<a href="/users" className="text-light nav-link">
									Usuarios
								</a>
							</li>
							<li key="inscripciones">
								<a href="/inscripciones" className="text-light nav-link">
									Ver Mis Inscripciones
								</a>
							</li>
							<li key="UserCerrarSesion">
								<a onClick={cerrarSesion} className="text-light nav-link" style={{ cursor: 'pointer' }}>
									Cerrar Sesión
								</a>
							</li>
						</ul>
					</div>
				</li>
			</div>
		);
	};

	const sesion = () => {
		if (cookies.get('_id')) {
			return completarMenu();
		} else {
			return (
				<a href="/login" className="nav-link text-white" style={{ cursor: 'pointer' }}>
					<strong>Ingresar</strong>
				</a>
			);
		}
	};

	async function cerrarSesion() {
		cookies.remove('_id', { path: '/' });
		cookies.remove('nombre', { path: '/' });
		cookies.remove('apellido', { path: '/' });
		cookies.remove('idRol', { path: '/' });
		window.location.href = '../inicio';
	}

	return (
		<div>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark navBlack box-shadow">
				<div className="container-fluid">
					<a href="/inicio" className="navbar-brand d-flex align-items-center">
						<img className="logo" src={Logo}></img>
					</a>
					<div className="text-light">{cookies.get('nombre')}</div>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<div>{sesion()}</div>
						</ul>
					</div>
				</div>
			</nav>
			<BrowserRouter>
				<Switch>
					<Route exact path={['/', '/Inicio']} component={Inicio} />
					<Route exact path={['/', '/users']} component={UsersList} />
					<Route exact path={['/', '/inscripciones']} component={InscripcionesList} />
					<Route exact path={['/', '/Inscripcion']} component={Inscripcion} />
					<Route exact path={['/', '/login']} component={Login} />
					<Route exact path={['/', '/errorPage']} component={ErrorPage} />
					<Route exact path={['/', '/miperfil']} component={MiPerfil} />
					<Route path="/miperfil/:_id" render={(props) => <MiPerfil {...props} />} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
