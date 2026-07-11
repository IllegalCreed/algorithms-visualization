import { fftModule } from '@/algorithms/fft.module';
import { createEnglishAdapter } from '../shared';

export const englishFftModule = createEnglishAdapter(fftModule, {
  title: 'Fast Fourier Transform',
  captions: {
    init: 'Load the coefficient sequence and the target transform length.',
    bitrev: 'Reorder indices by reversed bits so iterative butterflies access contiguous blocks.',
    twiddle: 'Prepare the roots-of-unity rotations for this butterfly layer.',
    butterfly: 'Combine the even and rotated odd values into the two outputs of this butterfly.',
    done: 'All logarithmic layers are complete and the frequency values are ready.',
  },
});
