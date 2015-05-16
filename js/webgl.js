function create3d() {

  var tau = Math.PI * 2;

  var renderer, scene, camera, cubes = [[],[]];

  var sw = window.innerWidth - 50,
    sh = window.innerHeight - 100;

  if (sw < 400) sw = 400;
  if (sh < 400) sh = 400;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, sw / sh, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(sw, sh);
  document.getElementById("webglcontainer").appendChild(renderer.domElement);

  group = new THREE.Object3D();
  scene.add(group);

  var groupAxisY = new THREE.Object3D();
  group.add(groupAxisY);

  var groupAxisX = new THREE.Object3D();
  group.add(groupAxisX);

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  var pointLight =  new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  scene.add(pointLight);

  var maxHeight = 40;
  camera.position.y = maxHeight / 2;
  camera.position.z = 100;

  var uniformsNSW = {
    time: { type: "f", value: 1.0 },
    resolution: { type: "v2", value: new THREE.Vector2() },
    red: { type: "f", value: 0.0 },
    green: { type: "f", value: 0.0 },
    blue: { type: "f", value: 1.0 },
  };
  var uniformsQLD = {
    time: { type: "f", value: 1.0 },
    resolution: { type: "v2", value: new THREE.Vector2() },
    red: { type: "f", value: 1.0 },
    green: { type: "f", value: 0.0 },
    blue: { type: "f", value: 0.4 },
  };

  var materialNSW = new THREE.ShaderMaterial( {
    uniforms: uniformsNSW,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  });

  var materialQLD = new THREE.ShaderMaterial( {
    uniforms: uniformsQLD,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  });



  function generateTick(label, major, xd, yd, zd, x, y, z) {

    var colours = major ? [0xc0c0c0, 0x505050] : [0x808080, 0x505050];

    // make dash
    var dashGeometry = new THREE.BoxGeometry(xd, yd, zd);
    var dashMaterial = new THREE.MeshPhongMaterial({
      ambient: colours[1],
      color: colours[0],
      specular: colours[0],
      shininess: 1,
      shading: THREE.SmoothShading
    } )
    var dash = new THREE.Mesh(dashGeometry, dashMaterial);

    var textMaterial = new THREE.MeshFaceMaterial([
      new THREE.MeshPhongMaterial({color: colours[0], shading: THREE.FlatShading}), // front
      new THREE.MeshPhongMaterial({color: colours[1], shading: THREE.SmoothShading}) // side
    ] );
    var textGeometry = new THREE.TextGeometry(label, {
      size: 2,
      height: 1,
      curveSegments: 1,
      font: 'helvetiker',
      // weight: weight,
      // style: style,
      material: 0,
      extrudeMaterial: 1
    });
    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();

    var text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.x = x;
    text.position.y = y;
    text.position.z = z;

    var tick = new THREE.Object3D();
    tick.add(dash);
    tick.add(text);

    return tick;
  }

  function generateTickX(label, major) {
    return generateTick(label, major, 0.3, 1, 0.3, -3, -3, 0);
  }

  function generateTickY(label, major) {
    return generateTick(label, major, 3, 0.3, 0.3, 2, -1, 0);
  }

  var gap = 2;
  var ticksX = [];
  var yearJump = 5;




      fixMaxY = function(largest, ticks) {
        var goodTick, num, roundNumbers, tick, _j, _len;
        roundNumbers = [
          1, 2, 5, 
          10, 20, 30, 40, 50, 60, 75, 80,
          100, 200, 300, 400, 500, 750, 800, 
          1000, 1250, 1500, 1750, 
          2000, 3000, 4000, 5000, 6000, 7500, 
          1e4, 2e4, 5e4, 1e5, 2e5, 5e5];
        tick = largest / ticks;
        goodTick = null;
        for (_j = 0, _len = roundNumbers.length; _j < _len; _j++) {
          num = roundNumbers[_j];
          if (tick < num) {
            goodTick = num;
          }
          if (goodTick !== null) {
            break;
          }
        }
        return goodTick * ticks;
      };
      var rand = Math.random() * 1e4; var maxY = fixMaxY(rand, 5); con.log(rand,maxY);
      var rand = Math.random() * 1e4; var maxY = fixMaxY(rand, 5); con.log(rand,maxY);
      var rand = Math.random() * 1e4; var maxY = fixMaxY(rand, 5); con.log(rand,maxY);
      var rand = Math.random() * 1e4; var maxY = fixMaxY(rand, 5); con.log(rand,maxY);











  function update(nsw, qld, max) {

    // TweenMax.to(groupAxisY, 0.5, {alpha: 0});

    function renderYear(fragmentShader, teamIndex, height, yearIndex) {

      var cube;

      var h = height / max * maxHeight;
      if (h == 0) h = 0.01;

      // var x = (-years.length / 2 + yearIndex + (teamIndex ? 0.25 : 0)) * gap,
      var x = (-years.length / 2 + yearIndex) * gap,
        y = h / 2,
        z = (teamIndex ? 1 : -1) * 2;


      if (cubes[teamIndex][yearIndex]) { // already exists, let's re use it!

        cube = cubes[teamIndex][yearIndex];

      } else {




        // con.log(document.getElementById( 'vertexShader' ).textContent);
        // con.log(document.getElementById( 'fragment_shader2' ).textContent);

        var geometry = new THREE.BoxGeometry(1,1,3);
        // var material2 = new THREE.MeshPhongMaterial( {
        //   ambient: 0x030303,
        //   color: colour,
        //   specular: 0x404040,
        //   shininess: 3,
        //   shading: THREE.SmoothShading
        // } )
        cube = new THREE.Mesh(geometry, fragmentShader);
        cubes[teamIndex][yearIndex] = cube;
        group.add(cube);

      }

      cube.position.x = x;
      cube.position.z = z;

      // cube.position.y = 0;
      // cube.scale.y = h ? h : 0.01;

      var delay = 0 + i * 0.02, ease = Bounce.easeOut;

      TweenMax.to(cube.scale, 1.5, {y: h, ease: ease, delay: delay});
      TweenMax.to(cube.position, 1.5, {x: x, y: y, z: z, ease: ease, delay: delay});

    }



    for (var i = 0, il = nsw.length; i < il; i++) {
      renderYear(materialNSW, 0, nsw[i], i);
    }

    for (i = 0, il = qld.length; i < il; i++) {
      renderYear(materialQLD, 1, qld[i], i);
    }

    for (var i = groupAxisY.children.length - 1; i > -1; i--) {
      groupAxisY.remove(groupAxisY.children[i]);
    }

    var maxY = fixMaxY(max, 5); // thanks Airtasker!

    var tickMesh = generateTickY(max, true);
    groupAxisY.add(tickMesh);
    tickMesh.position.y = maxHeight;

    var ticksVertical = 6;
    for (i = 0, il = ticksVertical; i < il; i++) {
      var perc = i / (il - 1);
      var text = perc * maxY;
      var y = perc * maxHeight * maxY / max;
      if (Math.abs(y - maxHeight) > 4) { // don't draw tick near major tick
        var tickMesh = generateTickY(text, false);
        groupAxisY.add(tickMesh);
        tickMesh.position.y = y;        
      }
    }



    for (i = 0, il = years.length / yearJump; i < il; i++) {
      if (ticksX[i] == undefined) {
        var yearIndex = i * yearJump;
        var text = years[yearIndex].year;
        var tickMesh = generateTickX(text, false);
        groupAxisX.add(tickMesh);
        tickMesh.position.x = (-years.length / 2 + yearIndex) * gap;
        ticksX[i] = tickMesh;
      }
    }

    groupAxisX.position.y = -0.5;
    groupAxisY.position.x = years.length / 2 * gap;


    // con.log("ticksVertical", ticksVertical)

  }

  var rotationY = 0, rotationX = 0;
  var interacting = false;

  function clampRotation(r) {
    return r < 0 ? r + tau : r > tau ? r - tau : r;
  }

  function interactStart() {
    interacting = true;
  }

  function interactMove(delta) {
    rotationY += delta.x * 0.01;
    rotationX += delta.y * 0.01;
    rotationY = clampRotation(rotationY);
  }

  function interactStop() {
    interacting = false;
  }

  function render(time) {

    if (interacting) {

    } else {
      rotationX -= (rotationX - 0) * 0.1;
    }

    uniformsQLD.time.value = time * 0.0012;
    uniformsNSW.time.value = time * 0.0011;

    var quarter = rotationY;// //Math.round( (( Math.PI * 2 + rotationY + Math.PI / 2) % (Math.PI * 2)) );

    var qldSide = (quarter > Math.PI / 2 && quarter < Math.PI * 2 * 3 / 4);

    // debug.innerHTML = quarter;
    // if (qldSide) {
    //   debug.style.background = "blue";
    // } else {
    //   debug.style.background = "red";
    // }

    // cube.rotation.x += 0.1;
    group.rotation.x = rotationX;
    group.rotation.y = rotationY;

    groupAxisY.rotation.y = -group.rotation.y;

    groupAxisX.position.z -= (groupAxisX.position.z - (qldSide ? -1 : 1) * 3) * 0.2;
    groupAxisY.position.z = groupAxisX.position.z;

    for (var i = 0, il = years.length / yearJump; i < il; i++) {
      if (ticksX[i]) {
        ticksX[i].rotation.x = -rotationX;
        ticksX[i].rotation.y = -rotationY;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render(0);


  return {
    interactStart: interactStart,
    interactStop: interactStop,
    interactMove: interactMove,
    update: update
  }

}