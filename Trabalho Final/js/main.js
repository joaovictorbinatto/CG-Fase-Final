var camera, scene, renderer, controls, clock, mixer;
var mtlLoader, objLoader;
var mario, luigi, bowser, clouds, cogu, castelo;
var som_morte, som_cogu;
var carrega_som = new THREE.AudioLoader();
var pontosReta = new THREE.Geometry();
var pontosSalto = new THREE.Geometry();
var count = 0, j = 0, jump = 0;
var play = 0;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 100;
    camera.position.z = 500;

	clock = new THREE.Clock();
    scene = new THREE.Scene();
	clouds = new Array();

	renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

	// adiciona luz ambiente
	var ambientLight = new THREE.AmbientLight(0x404040, 4.8);
	scene.add(ambientLight);

	// faz a camera mexer
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);

	// so permite mexer a camera horizontalmente
	controls.minPolarAngle = Math.PI/2;
	controls.maxPolarAngle = 0;
	controls.minAzimuthAngle = - Infinity;
	controls.maxAzimuthAngle = Infinity;

	carregaAudio();
//---------------------------------------------------------------------------------
	//carrega fundo
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/castelo/');
	mtlLoader.load('castelo.mtl', function(materials) {
		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/castelo/');

		objLoader.load('castelo.obj', function (object) {
			castelo = object;
			castelo.scale.set(95, 95, 95);
			castelo.rotateY(Math.PI*1.975);
			castelo.position.set(0, 0, -500);
			scene.add(castelo);
		});	

	});
//---------------------------------------------------------------------------------

	//carrega mario
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/mario/');
	mtlLoader.load('mario_obj.mtl', function(materials) {

		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/mario/');
		objLoader.load('mario_obj.obj', function (object) {
			mario = object;
        	mario.scale.set( 0.15, 0.15, 0.15 );
        	mario.rotateY(Math.PI/1.6);
        	mario.position.set(-50, -35, 0);

			scene.add(object);

			mariomovimento();
		});
	});
//--------------------------------------------------------------------

    //carrega luigi
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/mario/');
	mtlLoader.load('Luigi_obj.mtl', function(materials) {

		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/mario/');
		objLoader.load('Luigi_obj.obj', function (object) {
			luigi = object;
        	luigi.scale.set( 0.25, 0.25, 0.25 );
        	luigi.rotateY(Math.PI/1.6);
        	luigi.position.set(-50, -35, 10);

			scene.add(object);

			luigimovimento();
		});
	});
//---------------------------------------------------------------------

	// carrega o bowser
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/bowser/');
	mtlLoader.load('bowser.mtl', function(materials) {
		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/bowser/');

		
					objLoader.load('bowser.obj', function (object) {
						bowser = object;
						bowser.scale.set(3, 4, 3);
						bowser.rotateX(Math.PI*2);
						bowser.rotateY(Math.PI);
						bowser.position.set(55, -18, 0);
						scene.add(bowser);
					});	
		
	});
//---------------------------------------------------------------------------------

// carrega os cogumelo
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/cogumelo/');
	mtlLoader.load('kinoko.mtl', function(materials) {
		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/cogumelo/');

		
					objLoader.load('kinoko.obj', function (object) {
						cogu = object;
						cogu.scale.set(0.5, 0.5, 0.5);
						cogu.rotateX(Math.PI*2);
						cogu.position.set(-2, -35, 0);
						scene.add(cogu);
					});	
		
	});
	
//------------------------------------------------------------------------------------

    //carrega nuvem
	var texture = new THREE.TextureLoader().load( 'obj/cloud/cloud.jpg' );

	// carrega primeira nuvem
	objLoader = new THREE.OBJLoader();
    objLoader.load( 'obj/cloud/island-cloud.obj', function ( object ) {

		clouds[0] = object;
		clouds[0].scale.set(0.1, 0.1, 0.1);
		clouds[0].rotateX(Math.PI/2);
		clouds[0].position.set(50, 25, -20);

		clouds[0].traverse( function (child) {

			if (child instanceof THREE.Mesh)
				child.material.map = texture;
		} );

		scene.add(clouds[0]);
	});

	// carrega segunda nuvem
	objLoader = new THREE.OBJLoader();
    objLoader.load( 'obj/cloud/island-cloud.obj', function ( object ) {

		clouds[1] = object;
		clouds[1].scale.set(0.1, 0.1, 0.1);
		clouds[1].rotateX(Math.PI/2);
		clouds[1].position.set(-58, 20, -20);

		clouds[1].traverse( function (child) {

			if (child instanceof THREE.Mesh)
				child.material.map = texture;
		} );

		scene.add(clouds[1]);
	});
//-----------------------------------------------------------------------------------passaro


	mixer = new THREE.AnimationMixer(scene);
	
	var loader = new THREE.JSONLoader();
	loader.load( 'obj/stork.js', function ( geometry, materials ) {
		var material = materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex(0x000000);

		mesh = new THREE.Mesh(geometry, materials);

		mesh.position.set(20, 20, 0);

		mesh.scale.set(0.1, 0.1, 0.1);

		mesh.rotateY(Math.PI/2);

		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();

		scene.add(mesh);

		mixer.clipAction(geometry.animations[0], mesh)
				.setDuration(1)
				.startAt( - Math.random() )
				.play();
	} );


//-----------------------------------------------------------------------------------

	// carrega e aplica a texture do sol
	var textureLoader = new THREE.TextureLoader();

	uniforms = {

		fogDensity: { value: 0.0001 },
		fogColor:   { value: new THREE.Vector3(255, 203, 31) },
		time:       { value: 1.0 },
		uvScale:    { value: new THREE.Vector2(3.0, 1.0) },
		texture1:   { value: textureLoader.load("texture/lava/cloud.png") },
		texture2:   { value: textureLoader.load("texture/lava/lavatile.jpg") }

	};

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	// carrega o shader do sol
	var sunMaterial = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
	});

	// cria o sol e aplica o shader
	sun = new THREE.Mesh( new THREE.SphereGeometry(4, 32, 32), sunMaterial );
	sun.rotation.x = 0;
	sun.position.set(-65, 30, -50);
	scene.add(sun);
//-------------------------------------------------------------------------------------------

    window.addEventListener('resize', onWindowResize, false);
}

function carregaAudio() {
	audioListener = new THREE.AudioListener();
	camera.add(audioListener);
	som_morte = new THREE.Audio(audioListener);
	som_cogu  = new THREE.Audio(audioListener);
	scene.add(som_morte);
	scene.add(som_cogu);
	carrega_som.load (
		'audio/morte.mp3',
		function (audioBuffer) {
			som_morte.setBuffer( audioBuffer );
		},
		function (xhr) {
			console.log('audio carregado');
		}
	);
	carrega_som.load (
		'audio/cogu.mp3',
		function (audioBuffer) {
			som_cogu.setBuffer( audioBuffer );
		},
		function (xhr) {
			console.log('audio carregado');
		}
	);

}

function detectaColisao() {
	if (mario.position.x > 32 && mario.position.x < 37) {
		if (play == 1) {
			mario.scale.set(0, 0, 0);
			som_morte.play();
			play++;
		}
	}

	if (mario.position.x >-11) {
		if (play == 0) {
			mario.scale.set(0.25, 0.25, 0.25);
			cogu.scale.set(0, 0, 0);
			som_cogu.play();
			play++;
		}
	}
}

function mariofrente() {
	if(count == 20)
			return;

	mario.position.x = pontosReta.vertices[count].x;
	mario.position.y = pontosReta.vertices[count].y;
	mario.position.z = pontosReta.vertices[count].z;

	count++;

	detectaColisao();
}

function luigipulando() {

	luigi.position.x = pontosSalto.vertices[j].x;
	luigi.position.y = pontosSalto.vertices[j].y;
	luigi.position.z = pontosSalto.vertices[j].z;
}

function mariomovimento() {


	$(document).keydown(function(e){

		if (e.which == 39) {
			criaCurva("reta");
			mariofrente();
		}
	});

}

function luigimovimento() {

	$(document).keydown(function(e){

		if (e.which == 38) {
			jump = 1;
			j = 0;
			criaCurva("salto");

		}
	});

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {


	if (jump == 1 && j <= 20) {
		luigipulando();
		j++;
	}


	// faz o sol girar
	sun.rotation.y += 0.01;

	controls.update();

	render();
	requestAnimationFrame(animate);

}

function criaCurva(opc) {

	if(opc == "reta") {
		var reta = new THREE.QuadraticBezierCurve3(
			new THREE.Vector3(mario.position.x, -35, 0),
			new THREE.Vector3(mario.position.x/2, -35, 0),
			new THREE.Vector3(67, -35, 0)
		);

		pontosReta.vertices = reta.getPoints(20);
	}

	else if (opc == "salto") {
		var salto = new THREE.QuadraticBezierCurve3(
			new THREE.Vector3(luigi.position.x, -35, 0),
			new THREE.Vector3(luigi.position.x, 0, 0),
			new THREE.Vector3(luigi.position.x, -35, 0)
		);

		pontosSalto.vertices = salto.getPoints(20);
	}

}

function render() {
	mixer.update( clock.getDelta() );
	camera.lookAt(scene.position);
	renderer.render(scene, camera);

}
