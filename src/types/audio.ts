export interface AudioManifest {
  version: string;
  numbers: NumberAudioSection;
  effects: EffectAudioSection;
}

export interface NumberAudioSection {
  path: string;
  format: string;
  files: NumberAudioFile[];
}

export interface NumberAudioFile {
  number: number;
  filename: string;
  text: string;
}

export interface EffectAudioSection {
  path: string;
  format: string;
  files: EffectAudioFile[];
}

export interface EffectAudioFile {
  id: string;
  filename: string;
  description: string;
}

export type EffectType = 'correct' | 'incorrect' | 'complete';