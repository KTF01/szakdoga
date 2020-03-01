package hu.hkristof.parkingapp.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;

import hu.hkristof.parkingapp.models.Section;

public interface SectionRepository extends JpaRepository<Section, Long> {

}
