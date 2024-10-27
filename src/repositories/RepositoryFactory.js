import AuthRepository from '@/repositories/authRepository';
import UserRepository from '@/repositories/userRepository';
import CheckInRepository from '@/repositories/checkInRepository';
import AddressRepository from '@/repositories/addressRepository';

const repositories = {
    'auth': AuthRepository,
    'user': UserRepository,
    'checkIn': CheckInRepository,
    'address': AddressRepository,
}
export default {
    get: name => repositories[name]
};
