describe('Ejercicio 2: Realizar un POST al endpoint de carácter creando un nuevo registro con los datos necesarios. Validar la creación del registro desde el front​', () => {
    it('POST Character', () => {
        const seed = Date.now().toString();
        let newThumbnail = "";
        var newIsAlive = false;
        let newLocation = "Argentina";
        
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form: true,
            body:{
                thumbnail: newThumbnail,
                name: seed + "Lucas",
                realName: seed,
                location: newLocation,
                isAlive: newIsAlive,
            }
        }).then(async (response) => {
            await expect(response.status).to.eq(200);
            cy.visit('https://dsternlicht.github.io/RESTool/#/characters');
            
            cy.wait (1000);
            cy.scrollTo('bottom');
 
            cy.get('div.card>div:nth-child(3)>span').should('have.length.greaterThan', 8);

            expect(response.body.thumbnail).to.be.eq(newThumbnail)
            expect(response.body.name).to.be.eq(seed + "Lucas")
            expect(response.body.realName).to.be.eq(seed)
            expect(response.body.location).to.be.eq(newLocation)
            //Se insertan comillas automaticamente y no reconoce el valor como booleano
            //expect(response.body.isAlive).to.be.eq(false)

            cy.get('div>div:nth-child(3)>span').each(($el, index, $list) => {
                let characterCreated = false;
                
                if ($el.text() == response.body.name) {
                    characterCreated = true;
                    assert.isTrue(characterCreated, 'Check if element is displayed on frontend');
                    return;
                }
            }).then(($list) => {
                expect($list).to.have.length.greaterThan(1);
            })
            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/character/' + response.body.id
            }).then((response) => {
                expect(response.status).to.eq(200)
            })

            cy.reload();
        })
    })
})
