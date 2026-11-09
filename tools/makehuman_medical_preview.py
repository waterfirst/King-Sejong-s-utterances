import bpy
import os
from mathutils import Vector

for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

bpy.ops.mpfb.create_human()
human = bpy.data.objects["Human"]

# MPFB includes corrective keys and helper islands in the generated base mesh.
# They are useful while authoring a full body, but must not be exported to the
# small, face-only web asset.
while human.data.shape_keys and human.data.shape_keys.key_blocks:
    human.shape_key_remove(human.data.shape_keys.key_blocks[-1])

skin = bpy.data.materials.new("Clinical neutral skin")
skin.diffuse_color = (0.58, 0.67, 0.68, 1.0)
skin.use_nodes = True
bsdf = skin.node_tree.nodes.get("Principled BSDF")
bsdf.inputs["Base Color"].default_value = (0.32, 0.46, 0.48, 1)
bsdf.inputs["Roughness"].default_value = 0.58
human.data.materials.clear()
human.data.materials.append(skin)

# Keep only the actual head and a short section of neck.  MPFB helper islands
# begin after vertex 13379; removing them prevents the long vertical artifacts
# that appeared in the first web export.
bpy.context.view_layer.objects.active = human
human.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.mesh.select_mode(type='VERT')
bpy.ops.object.mode_set(mode='OBJECT')
for vertex in human.data.vertices:
    # Elliptical crop removes shoulders and torso while retaining the full face.
    head_outline = (vertex.co.x / .315) ** 2 + ((vertex.co.z - 1.515) / .235) ** 2
    vertex.select = vertex.index >= 13380 or head_outline > 1.12
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.delete(type='VERT')
bpy.ops.object.mode_set(mode='OBJECT')

def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat('-Z', 'Y').to_euler()

bpy.ops.object.camera_add(location=(0, -2.15, 1.43))
camera = bpy.context.object
aim(camera, (0, -0.05, 1.43))
bpy.context.scene.camera = camera
camera.data.lens = 235

for location, energy, size, color in [
    ((-1.1, -1.4, 2.25), 850, 1.3, (0.64, 0.86, 0.9)),
    ((1.25, -0.8, 1.65), 460, 1.0, (0.3, 0.53, 0.62)),
    ((0, 0.4, 2.5), 300, 1.2, (0.78, 0.91, 0.93)),
]:
    bpy.ops.object.light_add(type='AREA', location=location)
    light = bpy.context.object
    light.data.energy = energy
    light.data.shape = 'DISK'
    light.data.size = size
    light.data.color = color
    aim(light, (0, -0.05, 1.42))

world = bpy.context.scene.world
world.color = (0.004, 0.008, 0.012)
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.003, 0.008, 0.012, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.16

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 720
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = '/tmp/medical_head_preview.png'
scene.render.film_transparent = False
bpy.ops.wm.save_as_mainfile(filepath='/tmp/medical_speech_head.blend')
bpy.ops.render.render(write_still=True)

out = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'medical_speech_face.glb')
os.makedirs(os.path.dirname(out), exist_ok=True)
bpy.ops.object.select_all(action='DESELECT')
human.select_set(True)
bpy.context.view_layer.objects.active = human
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_animations=False, export_materials='EXPORT')
