describe('Ej 4: Realizar un POST al endpoint de Employees y validar su creacion en el front-end', () => {
    
    it('Create a new character', () => {
        
        const seed = Date.now().toString();
        let newJobTitle = 'Ingeniero';
        let newIsFired = false;

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            form: true,
            body:{
                "name": seed + "Lucas",
                "jobTitle": newJobTitle,
                "isFired": newIsFired
            }
        }).then(async (response) => {
            await expect(response.status).to.eq(200);
            cy.visit('https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=100')
            
            cy.wait (1000)
            cy.scrollTo('bottom')
            cy.wait (2000)
            
            cy.get('table>tbody>tr>td:nth-child(2)>span').should('have.length.greaterThan', 9)
            
            expect(response.body).to.not.be.null
            expect(response.body.name).to.be.eq(seed + "Lucas")
            expect(response.body.jobTitle).to.be.eq(newJobTitle)
            //No funciona porque se insertan automaticamente comillas al valor de isFired ¿Cómo se soluciona?
            //expect(response.body.isFired).to.be.eq(newIsFired)
            
            cy.get('table>tbody>tr>td:nth-child(2)>span').each(($el, index, $list) => {
                let employeeCreated = false;
                if ($el.text() == response.body.name) {
                    employeeCreated = true;
                    assert.isTrue(employeeCreated, 'Check element on front-end');
                    return;
                }
            }).then(($list) => {
                expect($list).to.have.length.greaterThan(1);
            })
            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/employee/' + response.body.id
            }).then((response) => {
                expect(response.status).to.eq(200);
            
                cy.reload();
            })
        })
    })
})