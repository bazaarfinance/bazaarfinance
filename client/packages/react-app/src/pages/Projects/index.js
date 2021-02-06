import React, { useRef, useState } from 'react'
import { addresses } from "@project/contracts";

import { useVaultContract, useProjects } from '../../hooks'
import { Jumbotron, JumbotronColumn, MainHeader, Button } from '../../theme'

import ProjectDetailsModal from '../../components/ProjectDetailsModal'

export function Projects() {

  const headingRef = useRef(null)

  const projects = useProjects(addresses.vaultFactory)
  // console.log(projects)

  const vault = useVaultContract(addresses.vault)

  const [projectDetailsModalIsOpen, setProjectDetailsModalIsOpen] = useState(false)
  const [selectedProjectSalary, setSelectedProjectSalary] = useState(0)
  const [selectedProjectRecipient, setSelectedProjectRecipient] = useState('')
  const [selectedProjectStartedSurplus, setSelectedProjectStartedSurplus] = useState(false)
  const [selectedProjectPrincipal, setSelectedProjectPrincipal] = useState(0)
        
  return (
    <>
      <Jumbotron ref={headingRef}>
        <JumbotronColumn>
            <MainHeader>Fund Project</MainHeader>
        </JumbotronColumn>
        <JumbotronColumn>
        <Button onClick={async () => {
            const salary = await vault.salary();
            setSelectedProjectSalary(salary);
            const recipient = await vault.recipient();
            setSelectedProjectRecipient(recipient);
            const principal = await vault.principal();
            const startedSurplus = await vault.startedSurplus();
            setSelectedProjectPrincipal(principal);
            setSelectedProjectStartedSurplus(startedSurplus);
            setProjectDetailsModalIsOpen(true);
        }}>View</Button>
        {projectDetailsModalIsOpen ?
              <ProjectDetailsModal 
              recipient={selectedProjectRecipient}
              salary={selectedProjectSalary.toString()}
              startedSurplus={selectedProjectStartedSurplus}
              principal={selectedProjectPrincipal.toString()}
              isOpen={projectDetailsModalIsOpen}
              onDismiss={() => setProjectDetailsModalIsOpen(false)} />
            : null }
        </JumbotronColumn>
      </Jumbotron>
    </>
  )
}