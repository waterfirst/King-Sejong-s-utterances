(() => {
    const root = document.getElementById('hangul-articulation');
    root.createArticulationScene = () => {
      const T = window.THREE;
      const views = root.querySelector('[data-views]');
      const mouthCanvas = root.querySelector('[data-mouth]');
      const foldsCanvas = root.querySelector('[data-folds]');
      const overview = new T.Scene();
      const larynx = new T.Scene();
      const sideCamera = new T.PerspectiveCamera(34, 1, 1, 1300);
      const foldCamera = new T.PerspectiveCamera(34, 1, 1, 500);
      const renderers = [mouthCanvas, foldsCanvas].map(canvas => {
        const renderer = new T.WebGLRenderer({canvas, alpha:true, antialias:true});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        return renderer;
      });
      const v = (x, y, z = 0) => new T.Vector3(x, -y, z);
      const curve = points => new T.CatmullRomCurve3(points.map(point => v(...point)));
      const material = roughness => new T.MeshStandardMaterial({roughness, side:T.DoubleSide});
      const soft = material(.74);
      const cut = material(.89);
      const mucosa = material(.53);
      const ivory = material(.37);
      const muscle = material(.51);
      const tendon = material(.45);
      const cavity = material(.88);
      const signal = new T.MeshBasicMaterial();
      const focusMaterial = new T.MeshBasicMaterial({depthTest:false});
      const facialMaterial = new T.MeshStandardMaterial({roughness:.48,transparent:true,opacity:.82});
      const skinMaterial = new T.MeshStandardMaterial({roughness:.68,transparent:true,opacity:.26,depthWrite:false});
      const skinShadowMaterial = new T.MeshStandardMaterial({roughness:.75,transparent:true,opacity:.19,depthWrite:false});
      const eyeMaterial = new T.MeshStandardMaterial({roughness:.25,metalness:.04});
      const irisMaterial = new T.MeshStandardMaterial({roughness:.31,metalness:.16});
      const lipDetailMaterial = new T.MeshStandardMaterial({roughness:.38,transparent:true,opacity:.92});
      const xrayMaterial = new T.MeshBasicMaterial({color:0x7bc8dc,wireframe:true,transparent:true,opacity:.22,depthWrite:false});
      const xrayLineMaterial = new T.LineBasicMaterial({color:0x91d8ea,transparent:true,opacity:.45,depthWrite:false});
      const xrayGroup = new T.Group();
      xrayGroup.visible = false;
      overview.add(xrayGroup);
      const swatch = document.createElement('canvas');
      swatch.width = swatch.height = 1;
      const painter = swatch.getContext('2d', {willReadFrequently:true});
      const cssColor = name => {
        const token = document.createElement('span');
        token.style.color = `var(${name})`;
        root.append(token);
        painter.clearRect(0,0,1,1);
        painter.fillStyle = getComputedStyle(token).color;
        painter.fillRect(0,0,1,1);
        token.remove();
        const [r,g,b] = painter.getImageData(0,0,1,1).data;
        return new T.Color().setRGB(r/255,g/255,b/255,T.SRGBColorSpace);
      };
      function palette() {
        const panel = cssColor('--background');
        const text = cssColor('--foreground');
        const pink = cssColor('--red');
        const amber = cssColor('--orange');
        soft.color.copy(panel).lerp(pink,.25).lerp(amber,.16);
        cut.color.copy(panel).lerp(amber,.32);
        mucosa.color.copy(pink).lerp(panel,.18);
        ivory.color.copy(panel).lerp(amber,.11).lerp(text,.13);
        muscle.color.copy(pink).lerp(amber,.11);
        tendon.color.copy(panel).lerp(pink,.25).lerp(text,.16);
        cavity.color.copy(text).lerp(pink,.11).lerp(panel,.11);
        signal.color.copy(cssColor('--viz-series-2'));
        focusMaterial.color.copy(cssColor('--viz-series-1'));
        facialMaterial.color.copy(cssColor('--viz-series-1'));
        skinMaterial.color.copy(panel).lerp(text,.18);
        skinShadowMaterial.color.copy(panel).lerp(text,.34);
        eyeMaterial.color.copy(panel).lerp(text,.12);
        irisMaterial.color.copy(cssColor('--viz-series-1'));
        lipDetailMaterial.color.copy(pink).lerp(panel,.1);
        if (cinematic) {
          soft.color.set('#1f5e70'); cut.color.set('#3b9db2'); mucosa.color.set('#f16d9a');
          ivory.color.set('#9ad9e5'); muscle.color.set('#62d8ca'); tendon.color.set('#d875a2');
          cavity.color.set('#0f2932'); signal.color.set('#f4c978'); focusMaterial.color.set('#f5d7a0');
          xrayMaterial.color.set('#74c5db'); xrayLineMaterial.color.set('#9edcf0');
          facialMaterial.color.set('#276274'); eyeMaterial.color.set('#d2f3f5'); irisMaterial.color.set('#1d91ad'); lipDetailMaterial.color.set('#f181aa');
          skinMaterial.color.set('#80969b'); skinShadowMaterial.color.set('#263c43');
        }
      }
      function light(scene) {
        scene.add(new T.AmbientLight(0xffffff,.62));
        const key = new T.DirectionalLight(0xffffff,2.1);
        key.position.set(-80,110,170);
        scene.add(key);
        const fill = new T.DirectionalLight(0xffffff,.72);
        fill.position.set(110,-60,40);
        scene.add(fill);
      }
      light(overview);
      light(larynx);
      function solid(scene, geometry, mat, position) {
        const mesh = new T.Mesh(geometry,mat);
        if (position) mesh.position.copy(position);
        scene.add(mesh);
        return mesh;
      }
      function tube(points, radius, mat) {
        return solid(overview,new T.TubeGeometry(curve(points),34,radius,12,false),mat);
      }
      const sphere = new T.SphereGeometry(1,28,18);
      function ellipsoid(scene, mat, point, scale) {
        const mesh = solid(scene,sphere,mat,v(...point));
        mesh.scale.set(...scale);
        return mesh;
      }

      // Retain the rear half of the cheek and skull. The near half is open to view the airway.
      const slice = new T.Shape();
      slice.moveTo(69,-64);
      slice.bezierCurveTo(64,-57,82,-50,93,-30);
      slice.bezierCurveTo(130,0,221,-8,251,-36);
      slice.bezierCurveTo(276,-61,271,-95,259,-119);
      slice.quadraticCurveTo(252,-140,264,-158);
      slice.quadraticCurveTo(242,-164,214,-159);
      slice.bezierCurveTo(196,-153,155,-158,119,-135);
      slice.bezierCurveTo(102,-122,94,-118,76,-111);
      slice.lineTo(83,-82);
      slice.quadraticCurveTo(85,-68,69,-64);
      solid(overview,new T.ExtrudeGeometry(slice,{depth:17,bevelEnabled:true,bevelThickness:3,bevelSize:3,bevelSegments:3}),soft,new T.Vector3(0,0,-42));
      tube([[76,61,-15],[108,44,-15],[163,43,-16],[208,55,-17],[230,78,-17]],6,soft);
      tube([[92,84,-3],[115,74,-4],[145,65,-6],[171,64,-9],[192,69,-11]],5,cut);
      const velum = tube([[183,68,-12],[200,71,-8],[214,77,-5],[220,82,-6]],4,mucosa);
      const velumPivot = new T.Group();
      velumPivot.position.copy(v(183,68,-12));
      velum.position.copy(velumPivot.position).negate();
      velumPivot.add(velum);
      overview.add(velumPivot);
      tube([[239,76,-12],[245,102,-10],[245,124,-8],[245,154,-6]],5,soft);
      tube([[227,149,-9],[232,134,-9],[229,117,-10]],4,soft);
      const tooth = solid(overview,new T.BoxGeometry(8,12,13),ivory,v(104,86,-1));
      tooth.rotation.z = -.16;
      const upperLip = ellipsoid(overview,mucosa,[80,86,1],[10,4.8,12]);
      const lowerLip = ellipsoid(overview,mucosa,[80,105,1],[10,5.2,12]);
      const upperGum = ellipsoid(overview,soft,[93,82,-7],[15,6,12]);
      const lowerGum = ellipsoid(overview,soft,[95,110,-7],[17,7,12]);
      const jaw = ellipsoid(overview,cut,[135,130,-11],[55,8,13]);
      jaw.rotation.z = -.26;

      // Facial landmarks make the x-ray view read as a human profile while the moving parts
      // remain the educational lips, tongue and airway model below.
      const faceShell = new T.Group();
      faceShell.visible = false;
      overview.add(faceShell);
      const scalp = ellipsoid(faceShell,skinMaterial,[165,81,-25],[94,103,65]);
      const cheek = ellipsoid(faceShell,skinMaterial,[111,102,1],[57,66,48]);
      const chin = ellipsoid(faceShell,skinMaterial,[122,130,2],[48,34,43]);
      const earNear = ellipsoid(faceShell,skinShadowMaterial,[206,91,45],[12,23,8]);
      const earFar = ellipsoid(faceShell,skinShadowMaterial,[206,91,-45],[12,23,8]);
      const browRidge = ellipsoid(faceShell,skinShadowMaterial,[120,51,1],[34,8,48]);
      const faceDetails = new T.Group();
      faceDetails.visible = false;
      overview.add(faceDetails);
      const noseBridge = ellipsoid(faceDetails,facialMaterial,[96,61,-3],[20,10,15]);
      const nose = new T.Mesh(new T.ConeGeometry(10,32,20),facialMaterial);
      nose.position.copy(v(79,68,-1)); nose.rotation.z=Math.PI/2; faceDetails.add(nose);
      const nostril = new T.Mesh(new T.TorusGeometry(3.3,.65,8,20),xrayMaterial);
      nostril.position.copy(v(65,73,9)); faceDetails.add(nostril);
      const eyeSocket = new T.Mesh(new T.TorusGeometry(14,1.1,12,28),xrayMaterial);
      eyeSocket.position.copy(v(121,58,7)); eyeSocket.scale.x=1.22; faceDetails.add(eyeSocket);
      const eye = ellipsoid(faceDetails,eyeMaterial,[116,59,8],[10,7.5,8]);
      const iris = ellipsoid(faceDetails,irisMaterial,[108,59,14],[3.2,4.4,1.4]);
      const farEye = ellipsoid(faceDetails,eyeMaterial,[116,59,-31],[8.5,6.6,7]);
      const farIris = ellipsoid(faceDetails,irisMaterial,[108,59,-36],[2.8,3.8,1.1]);
      const brow = new T.Mesh(new T.TorusGeometry(16,.8,8,28,Math.PI),xrayMaterial);
      brow.position.copy(v(120,48,7)); brow.rotation.z=.20; faceDetails.add(brow);
      const upperLipRidge = ellipsoid(faceDetails,lipDetailMaterial,[77,84,13],[11,2.3,4.8]);
      const lowerLipRidge = ellipsoid(faceDetails,lipDetailMaterial,[77,106,13],[11,2.7,5.4]);
      const mouthCorner = ellipsoid(faceDetails,lipDetailMaterial,[84,96,12],[3.5,3.5,3.5]);
      const tongueTip = ellipsoid(faceDetails,muscle,[78,106,8],[12,5,8]);
      const tongueRidge = ellipsoid(faceDetails,facialMaterial,[123,99,13],[33,1.1,1.4]);

      // A separate, low-opacity wireframe silhouette is only shown in 3D video mode.
      // It is an educational x-ray cue, not an anatomical measurement or scan.
      const cranium = new T.Mesh(new T.SphereGeometry(1,30,20),xrayMaterial);
      cranium.position.copy(v(162,82,-23)); cranium.scale.set(92,101,63); xrayGroup.add(cranium);
      const face = new T.Mesh(new T.SphereGeometry(1,24,16),xrayMaterial);
      face.position.copy(v(104,99,-18)); face.scale.set(51,65,46); xrayGroup.add(face);
      const xrayCurve = points => new T.Line(new T.BufferGeometry().setFromPoints(curve(points).getPoints(70)),xrayLineMaterial);
      xrayGroup.add(xrayCurve([[75,57,-25],[62,69,-25],[62,103,-25],[77,129,-25],[110,145,-25],[166,155,-25],[216,153,-25],[250,143,-25]]));
      xrayGroup.add(xrayCurve([[91,52,-25],[131,35,-25],[181,35,-25],[227,54,-25],[246,78,-25]]));
      xrayGroup.add(xrayCurve([[92,116,-24],[123,137,-24],[171,146,-24],[207,142,-24]]));
      const vertebrae = new T.Group();
      for (let i=0;i<6;i++) {
        const ring = new T.Mesh(new T.TorusGeometry(9.5,1,8,20),xrayMaterial);
        ring.position.copy(v(241,137+i*13,-20)); ring.rotation.x=Math.PI/2; vertebrae.add(ring);
      }
      xrayGroup.add(vertebrae);

      function surface(rows, sides, scene, mat) {
        const geometry = new T.BufferGeometry();
        const positions = new T.Float32BufferAttribute(new Float32Array((rows+1)*(sides+1)*3),3);
        const indices = [];
        for (let row=0; row<rows; row++) for (let side=0; side<sides; side++) {
          const index = row*(sides+1)+side;
          indices.push(index,index+sides+1,index+1,index+1,index+sides+1,index+sides+2);
        }
        geometry.setAttribute('position',positions);
        geometry.setIndex(indices);
        const mesh = solid(scene,geometry,mat);
        mesh.frustumCulled = false;
        return update => {
          for (let row=0; row<=rows; row++) for (let side=0; side<=sides; side++) {
            positions.setXYZ(row*(sides+1)+side,...update(row/rows,side/sides));
          }
          positions.needsUpdate = true;
          geometry.computeVertexNormals();
        };
      }
      const drawTongue = surface(40,24,overview,muscle);
      const ring = solid(overview,new T.TorusGeometry(7,1,8,30),focusMaterial);
      ring.renderOrder = 2;
      const airflow = Array.from({length:15}, () => ellipsoid(overview,signal,[0,0,0],[1.7,1.7,1.7]));
      const airway = ellipsoid(larynx,cavity,[0,0,-3],[15,22,3]);
      airway.rotation.z = .07;
      const frame = solid(larynx,new T.TorusGeometry(16,3.6,16,48),mucosa,new T.Vector3(0,0,-1));
      frame.scale.y = 1.29;
      const folds = [-1,1].map(side => ({side, deform:surface(34,18,larynx,tendon)}));
      const attachments = [-1,1].map(side => ellipsoid(larynx,mucosa,[side*5,17,1],[4.8,4.5,3.2]));

      function fit(renderer,camera) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const current = renderer.getSize(new T.Vector2());
        if (current.width !== width || current.height !== height) renderer.setSize(width,height,false);
        camera.aspect = width / Math.max(1,height);
        camera.updateProjectionMatrix();
      }
      let last;
      const orbit = {yaw:0,pitch:0};
      let dragging = null;
      mouthCanvas.addEventListener('pointerdown',event => {
        dragging = {id:event.pointerId,x:event.clientX,y:event.clientY};
        mouthCanvas.setPointerCapture(event.pointerId);
        mouthCanvas.classList.add('is-dragging');
      });
      mouthCanvas.addEventListener('pointermove',event => {
        if (!dragging || dragging.id !== event.pointerId) return;
        orbit.yaw = Math.max(-1.18,Math.min(1.18,orbit.yaw+(event.clientX-dragging.x)*.012));
        orbit.pitch = Math.max(-.48,Math.min(.48,orbit.pitch+(event.clientY-dragging.y)*.008));
        dragging.x=event.clientX; dragging.y=event.clientY;
        if (last) draw(last);
      });
      const endDrag = event => {
        if (!dragging || dragging.id !== event.pointerId) return;
        dragging=null; mouthCanvas.classList.remove('is-dragging');
      };
      mouthCanvas.addEventListener('pointerup',endDrag);
      mouthCanvas.addEventListener('pointercancel',endDrag);
      let cinematic = false;
      function draw(state) {
        last = state;
        const {tongue, lipX, lipY, round, contact, nasal, velumOpening, lateral, air, strong, voiced, glottalGap, x, y, zoom, step, still} = state;
        const [tipX,tipY,frontX,frontY,backX,backY,rootX,rootY] = tongue;
        const spine = curve([[tipX,tipY],[frontX,frontY],[backX,backY],[rootX,rootY],[217,141]]);
        drawTongue((u,w) => {
          const p = spine.getPoint(u);
          const fullness = Math.pow(Math.sin(Math.PI*u),.66);
          const height = 1.2 + 15*fullness;
          const width = 1.3 + (16+4*u)*fullness;
          const angle = w*2*Math.PI;
          return [p.x,p.y-height*(1-Math.cos(angle)),width*Math.sin(angle)-5];
        });
        upperLip.position.set(lipX,-85,1);
        lowerLip.position.set(lipX,-lipY-4,1);
        upperLip.scale.z = lowerLip.scale.z = 12-4.5*round;
        upperLip.scale.x = lowerLip.scale.x = 10+2*round;
        upperLipRidge.position.set(lipX-2,-85,13);
        upperLipRidge.scale.set(10+2*round,2.2,4.8-1.3*round);
        lowerLipRidge.position.set(lipX-2,-lipY-4,13);
        lowerLipRidge.scale.set(10+2*round,2.7,5.4-1.4*round);
        mouthCorner.position.set(lipX+4,-(lipY+88)/2,12);
        tongueTip.position.copy(v(tipX+2,tipY+5,8));
        tongueTip.scale.set(11,4.4,7.4);
        tongueRidge.position.copy(v((tipX+backX)/2+7,(tipY+backY)/2+5,13));
        tongueRidge.rotation.z=Math.atan2(-(tipY-backY),tipX-backX);
        chin.position.y=-130-.32*(lipY-92);
        upperGum.position.x = (lipX+100)/2;
        lowerGum.position.set((lipX+107)/2,-lipY-7,-7);
        upperGum.scale.x = 15+3*round;
        lowerGum.scale.x = 17+3*round;
        jaw.position.y = -127 - .38*(lipY-92);
        jaw.rotation.z = -.17 - .008*(lipY-92);
        velumPivot.rotation.z = -.20 * velumOpening;
        ring.visible = Boolean(contact);
        if (contact) ring.position.copy(v(...contact,23));
        const stream = nasal
          ? curve([[234,140,0],[236,92,1],[210,55,2],[145,47,4],[102,49,4],[68,59,5]])
          : lateral ? curve([[234,140,2],[228,99,4],[185,101,15],[137,97,18],[111,95,16],[lipX-25,(lipY+89)/2,7]])
          : curve([[234,140,2],[233,98,2],[219,Math.min(96,rootY-8),3],[(backX+frontX)/2,(backY+frontY)/2-7,4],[tipX-4,Math.min(tipY-5,(lipY+89)/2),6],[lipX-25,(lipY+89)/2,7]]);
        airflow.forEach((particle,index) => {
          particle.visible = air;
          if (!air) return;
          const t = (index/airflow.length + (still ? 0 : step*(strong ? 2.0 : 1.2))) % 1;
          particle.position.copy(stream.getPoint(t));
          particle.scale.setScalar((strong ? 2.1 : 1.5)*(1+.27*Math.sin(index*2)));
        });

        const pulse = voiced && !still ? Math.sin(step*2*Math.PI*4.5) : 0;
        xrayGroup.rotation.y = cinematic ? .08*Math.sin(step*.8) : 0;
        faceDetails.rotation.y = xrayGroup.rotation.y;
        xrayMaterial.opacity = cinematic ? .18 + .06*(voiced ? .5+.5*Math.sin(step*12)**2 : 0) : .22;
        const gap = Math.max(.09,glottalGap+.87*pulse);
        attachments.forEach((mesh,index) => { mesh.position.x = folds[index].side * (4+.36*gap); });
        for (const {side,deform} of folds) {
          deform((u,w) => {
            const profile = Math.sin(Math.PI*u);
            const rim = (gap*Math.pow(profile,.9)+.7*u);
            const outer = rim + 7.8*profile;
            const angle = w*2*Math.PI;
            const cx = side * ((outer+rim)/2 + (outer-rim)/2*Math.cos(angle));
            return [cx,18-36*u,2+2.4*profile*Math.sin(angle)+.6*pulse*profile];
          });
        }

        fit(renderers[0],sideCamera);
        fit(renderers[1],foldCamera);
        const zoomAdjustment = Math.max(1,1.55/sideCamera.aspect);
        const dist = 333/Math.sqrt(zoom)*zoomAdjustment;
        const sway = still ? 13 : 13+10*Math.sin(Math.PI*step/2.4);
        const sideAngle=orbit.yaw;
        sideCamera.position.set(
          x+sway*Math.cos(sideAngle)+dist*Math.sin(sideAngle),
          -y+18+Math.sin(orbit.pitch)*dist*.36,
          dist*Math.cos(sideAngle)-sway*Math.sin(sideAngle)
        );
        sideCamera.lookAt(x,-y,0);
        foldCamera.position.set(3,-9,Math.max(83,67/foldCamera.aspect));
        foldCamera.lookAt(0,0,0);
        renderers[0].render(overview,sideCamera);
        renderers[1].render(larynx,foldCamera);
      }
      const resize = new ResizeObserver(() => { if (last) draw(last); });
      resize.observe(views);
      const theme = window.matchMedia('(prefers-color-scheme: dark)');
      theme.addEventListener('change', () => { palette(); if (last) draw(last); });
      palette();
      views.hidden = false;
      root.querySelector('.stage').setAttribute('hidden','');
      function setCinematic(next) {
        cinematic = Boolean(next);
        xrayGroup.visible = cinematic;
        faceShell.visible = cinematic;
        faceDetails.visible = cinematic;
        renderers.forEach(renderer=>renderer.setClearColor(cinematic ? 0x05090d : 0x000000,cinematic ? 1 : 0));
        palette();
        if (last) draw(last);
      }
      function resetView() {
        orbit.yaw=0; orbit.pitch=0;
        if (last) draw(last);
      }
      return {draw,setCinematic,resetView};
    };
  })();
