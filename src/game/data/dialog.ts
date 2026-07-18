import type { DialogTree } from '../types'

export const DIALOG_TREES: Record<string, DialogTree> = {
  dadKitchen: {
    id: 'dadKitchen',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Dad',
        text: 'Have you seen my coffee mug anywhere? And... have you seen Olive?',
        choices: [
          { text: "I'll help you find your mug.", next: 'helping' },
          { text: 'No sign of Olive yet.', next: 'worried' },
        ],
      },
      helping: {
        id: 'helping',
        speaker: 'Dad',
        text: 'Thanks, kiddo. I bet it turns up somewhere in here.',
      },
      worried: {
        id: 'worried',
        speaker: 'Dad',
        text: 'Hmm. Ask your sister — she was playing with Olive earlier.',
        onEnter: { hint: 'Maybe Sister knows where Olive went.' },
      },
    },
  },
  sisterBedroom: {
    id: 'sisterBedroom',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Sister',
        text: "Ugh, I can't find this lego leg anywhere. Help me look?",
        choices: [
          { text: "Sure, let's find it.", next: 'thanks' },
          { text: 'Have you seen Olive?', next: 'oliveHint' },
        ],
      },
      thanks: {
        id: 'thanks',
        speaker: 'Sister',
        text: "You're the best. It's gotta be here somewhere.",
      },
      oliveHint: {
        id: 'oliveHint',
        speaker: 'Sister',
        text: 'I think I heard barking in the living room!',
        onEnter: { hint: 'Check the living room.' },
      },
    },
  },
  axelLivingRoom: {
    id: 'axelLivingRoom',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Axel',
        text: '*wags tail excitedly and drops a pooh bear at your feet*',
        next: 'greet',
      },
      greet: {
        id: 'greet',
        speaker: 'You',
        text: 'Hey Axel! Do you know where Olive is?',
        next: 'bark',
      },
      bark: {
        id: 'bark',
        speaker: 'Axel',
        text: '*barks happily and trots toward the door*',
        onEnter: {
          setFlags: ['axelFollowing'],
          hint: 'Axel wants you to follow him to the dog park.',
        },
      },
    },
  },
  momDogPark: {
    id: 'momDogPark',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Mom',
        text: "We're all here looking for Olive! Help us find her toys, she can't have gone far.",
      },
    },
  },
  oliveFinale: {
    id: 'oliveFinale',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Olive',
        text: '*happy barking* Surprise! Happy Birthday!',
        next: 'reveal',
      },
      reveal: {
        id: 'reveal',
        speaker: 'You',
        text: 'Olive, you sneaky pup — this was all a party trick!',
        onEnter: {
          setFlags: ['gameComplete'],
          hint: 'All memories are unlocked. Open the gallery to relive them!',
        },
      },
    },
  },
}
