<?php

namespace App\Mail;

use App\Models\Sale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf; // Importamos el generador de PDF

class ReceiptEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $sale; // Variable para guardar la venta

    /**
     * Recibimos la venta cuando llamemos a esta clase.
     */
    public function __construct(Sale $sale)
    {
        $this->sale = $sale;
    }

    /**
     * Asunto del correo.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recibo de tu compra - Orden ' . $this->sale->order_number,
        );
    }

    /**
     * El cuerpo del correo (el mensaje de texto/HTML que verá en su bandeja).
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.receipt_body', // Crearemos esta vista en el paso 3
        );
    }

    /**
     * Los archivos adjuntos (Aquí generamos el PDF al vuelo).
     */
    public function attachments(): array
    {
        // 1. Generamos el PDF usando otra vista Blade
        $pdf = Pdf::loadView('emails.receipt_pdf', ['sale' => $this->sale]);

        // 2. Lo adjuntamos sin necesidad de guardarlo en el disco duro
        return [
            Attachment::fromData(fn () => $pdf->output(), 'Recibo-' . $this->sale->order_number . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}