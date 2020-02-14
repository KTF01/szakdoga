package hu.hkristof.parkingapp.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.hkristof.parkingapp.models.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, String> {

}
