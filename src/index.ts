import { Litepicker } from './litepicker';
import './methods';

if (typeof window !== 'undefined') {
    (window as any).Litepicker = Litepicker;
}

export { Litepicker };
export default Litepicker;
