import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatName'
})
export class FormatNamePipe implements PipeTransform {

  transform(value: string, formatType: 'name' | 'username'): string {
    let names = value.split(" ");
    let formattedNames = [];
    /*names.map( n => n !== names[names.length - 1] ?
        n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase() : n.toUpperCase()
    {
      if (n !== names[names.length - 1]) {
        n = n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase();
      } else {
        n = n.toUpperCase();
      }
      console.log(" Valeur formatée "+ n)
      return n;
    }
    );*/
    for (let n of names) {
      let firstName = formatType === 'name' ? n.substring(1).toLowerCase() : n.substring(1);
      if (n !== names[names.length - 1]) {
        n = n.substring(0, 1).toUpperCase() + firstName;
      } else {
        let lastName = formatType === 'name' ? n.toUpperCase() : n.substring(0, 1).toUpperCase() + firstName;
        n = lastName;
      }
      formattedNames.push(n);
    }
    return formattedNames.join(" ");
  }

}
