import {
  Monitor, Network, Code2, GitBranch, Radio, Zap, Gamepad2, Play,
  Layout, Volume2, Box, Sliders, Sun, Car, User,
  Layers, Flame, Brush, Sparkles, Upload,
  Globe, Glasses, Navigation, Hand, Gauge, Music, Target,
  Users, BookOpen, Package, RefreshCw, Copy, Cpu, MousePointer,
  Shield, Palette, Hammer, Trophy, Wrench, Eye, LayoutGrid, Wand2,
  ScanLine, Building, Sword, type LucideIcon,
} from 'lucide-react'

interface Rule {
  pattern: RegExp
  icon: LucideIcon
}

const RULES: Rule[] = [
  // Editor / Interface
  { pattern: /editor|interface|navigation|workspace/i, icon: Monitor },

  // Scenes / Nodes / Graph
  { pattern: /scene|node|graph|hierarchy/i, icon: Network },

  // Scripting / Code
  { pattern: /gdscript|c#|scripting|script|variable|type|function|coding|programming/i, icon: Code2 },

  // Control Flow
  { pattern: /control flow|if.?else|loop|match|condition/i, icon: GitBranch },

  // Signals / Events
  { pattern: /signal|event|callback|listener/i, icon: Radio },

  // Physics
  { pattern: /physics|rigidbody|collision|collider|area|force|gravity/i, icon: Zap },

  // Input
  { pattern: /input|controller|keyboard|mouse|gamepad/i, icon: Gamepad2 },

  // Animation
  { pattern: /animation|animated|sequencer|keyframe|timeline|clip/i, icon: Play },

  // UI / Canvas / Control Nodes
  { pattern: /ui|canvas|control node|hud|widget|panel|menu/i, icon: Layout },

  // Audio
  { pattern: /audio|sound|music|sfx|volume/i, icon: Volume2 },

  // Mesh / Object Mode
  { pattern: /mesh|object mode|edit mode|polygon|vertex|edge|face/i, icon: Box },

  // Mesh editing operations
  { pattern: /extrude|inset|loop cut|bevel|knife|subdivide/i, icon: Wrench },

  // Modifiers / Non-destructive
  { pattern: /modifier|non-destructive|boolean|array modifier/i, icon: Sliders },

  // UV Unwrapping
  { pattern: /uv|unwrap|seam|texel/i, icon: ScanLine },

  // Lighting & Rendering
  { pattern: /light|render|hdri|sun|shadow|post.?process/i, icon: Sun },

  // Materials / Shaders
  { pattern: /material|shader|pbr|roughness|metallic|albedo|node editor/i, icon: Palette },

  // Baking
  { pattern: /bak|ambient occlusion|normal map/i, icon: Flame },

  // Layer / Mask system
  { pattern: /layer|mask|blend mode/i, icon: Layers },

  // Painting / Brush
  { pattern: /paint|brush|stamp|stencil/i, icon: Brush },

  // Smart materials
  { pattern: /smart material|procedural|generator/i, icon: Sparkles },

  // Filters / Effects
  { pattern: /filter|effect|blur|warp/i, icon: Wand2 },

  // Export / Import
  { pattern: /export|import|fbx|gltf|obj|texture set/i, icon: Upload },

  // Blueprints / Visual Scripting
  { pattern: /blueprint|visual script|flow graph/i, icon: LayoutGrid },

  // Level design / World
  { pattern: /level|world|terrain|landscape|environment|map/i, icon: Globe },

  // Actors / Components / GameObjects
  { pattern: /actor|component|gameobject|prefab/i, icon: Package },

  // Lifecycle / MonoBehaviour
  { pattern: /lifecycle|monobehaviour|start|update|awake|destroy/i, icon: RefreshCw },

  // Scene management
  { pattern: /scene management|loading|transition/i, icon: Copy },

  // XR / VR / AR
  { pattern: /xr|vr|virtual reality|augmented|mixed reality|openxr|xr toolkit/i, icon: Glasses },

  // Locomotion / Movement
  { pattern: /locomotion|teleport|smooth movement|comfort/i, icon: Navigation },

  // Hand tracking / Controllers
  { pattern: /hand track|controller|gesture|grip|trigger/i, icon: Hand },

  // Interaction
  { pattern: /interaction|grab|interactable|ray|pointer/i, icon: MousePointer },

  // Performance / Optimisation
  { pattern: /performance|optimis|batching|draw call|lod|culling|profil/i, icon: Gauge },

  // Hardware / SDK / Setup
  { pattern: /hardware|sdk|setup|install|headset|device|oculus|quest/i, icon: Cpu },

  // Spatial UI / In-world UI
  { pattern: /spatial|in.?world|billboard|world space/i, icon: Eye },

  // Concert / Exhibition / Cinematic
  { pattern: /concert|exhibition|cinematic|showcase|alegria/i, icon: Music },

  // Security / Shield
  { pattern: /shield/i, icon: Shield },

  // Barrel
  { pattern: /barrel/i, icon: Package },

  // Sword / Weapon — Lucide has Sword since v0.263
  { pattern: /sword|weapon|blunderbuss|gun|rifle/i, icon: Sword },

  // Vehicles
  { pattern: /car|vehicle|truck/i, icon: Car },

  // Characters / Figures
  { pattern: /character|man|woman|humanoid|figure|creature|monster|old man/i, icon: User },

  // Architecture / Structures
  { pattern: /well|building|house|room|architecture|bedroom|interior/i, icon: Building },

  // Concepts / Theory / Terminology
  { pattern: /concept|terminolog|theor|overview|introduction|workflow/i, icon: BookOpen },

  // Individual exercise / personal
  { pattern: /personal exercise|individual exercise/i, icon: Hammer },

  // Individual project
  { pattern: /individual project/i, icon: Target },

  // Group project
  { pattern: /group project/i, icon: Users },

  // Generic project
  { pattern: /project/i, icon: Trophy },

  // Exercise
  { pattern: /exercise/i, icon: Hammer },
]

export function getTopicIcon(title: string): LucideIcon {
  for (const { pattern, icon } of RULES) {
    if (pattern.test(title)) return icon
  }
  return BookOpen
}
