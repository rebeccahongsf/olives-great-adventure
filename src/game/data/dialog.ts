import type { DialogTree } from '../types'

export const DIALOG_TREES: Record<string, DialogTree> = {
  // Progresses one stage per separate approach (talk, walk away, talk again)
  // rather than all at once in a single conversation: each node sets the
  // flag for "where to resume" as soon as it's entered, and entryPoints
  // routes the next startDialog call there. See DialogEntryPoint in types.ts.
  momIntro: {
    id: 'momIntro',
    startNodeId: 'greeting',
    entryPoints: [
      { flag: 'momIntroBusy', nodeId: 'busy' },
      { flag: 'momIntroChoices', nodeId: 'askChoices' },
      { flag: 'momIntroTea', nodeId: 'tea' },
    ],
    nodes: {
      greeting: {
        id: 'greeting',
        speaker: 'Mom',
        text: 'Good morning!',
        onEnter: { setFlags: ['momIntroTea'] },
      },
      tea: {
        id: 'tea',
        speaker: 'Mom',
        text: "I'm just enjoying my tea and plants.",
        onEnter: { setFlags: ['momIntroChoices'] },
      },
      askChoices: {
        id: 'askChoices',
        speaker: 'Mom',
        text: 'What do you need?',
        choices: [
          { text: "I'm looking for Olive, have you seen her?", next: 'oliveAnswer' },
          { text: 'Nothing', next: 'askChoices' },
        ],
      },
      oliveAnswer: {
        id: 'oliveAnswer',
        speaker: 'Mom',
        text: "Hm. Not sure. Try asking dad. He's in the kitchen.",
        onEnter: { setFlags: ['momIntroBusy'], hint: "Try asking Dad — he's in the kitchen." },
      },
      busy: {
        id: 'busy',
        speaker: 'Mom',
        text: '...',
      },
    },
  },
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
