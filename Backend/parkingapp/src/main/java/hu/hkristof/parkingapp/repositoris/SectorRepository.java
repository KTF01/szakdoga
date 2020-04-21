package hu.hkristof.parkingapp.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;

import hu.hkristof.parkingapp.models.Sector;

public interface SectorRepository extends JpaRepository<Sector, Long> {

}
